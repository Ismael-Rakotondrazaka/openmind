import type { Article, User, Comment } from "@prisma/client";
import {
  type StoreCommentData,
  type StoreCommentError,
  createBadRequestError,
  createUnauthorizedError,
  getRequestErrorMessage,
  type Reaction,
  StoreCommentDataSchema,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<StoreCommentData | StoreCommentError> => {
    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    const storeCommentBodySPR = await safeParseRequestBodyAs(
      event,
      StoreCommentBodySchema,
    );

    if (!storeCommentBodySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(storeCommentBodySPR),
      });
    }

    const article: Article | null =
      await event.context.prisma.article.findFirst({
        where: {
          id: storeCommentBodySPR.data.articleId,
          deletedAt: null,
          isVisible: true,
        },
      });

    if (article === null) {
      return createBadRequestError(event, {
        errorMessage: {
          articleId: "The article does not exist.",
        },
      });
    }

    if (
      storeCommentBodySPR.data.parentId !== null &&
      storeCommentBodySPR.data.parentId !== undefined
    ) {
      const comment: Comment | null =
        await event.context.prisma.comment.findFirst({
          where: {
            id: storeCommentBodySPR.data.parentId,
            deletedAt: null,
          },
        });

      if (comment === null) {
        return createBadRequestError(event, {
          errorMessage: {
            articleId: "The comment does not exist.",
          },
        });
      }

      if (comment.parentId !== null) {
        return createBadRequestError(event, {
          errorMessage: {
            articleId: "Cannot reply to the comment.",
          },
        });
      }
    }

    const commentId: string = createCommentId();
    const now: Date = new Date();

    const { content, filesToSave } = formatCommentContent(
      storeCommentBodySPR.data.content,
      commentId,
    );

    Promise.allSettled(filesToSave.map(saveUploadedFile));

    const comment: StoreCommentData["comment"] =
      await event.context.prisma.comment
        .create({
          data: {
            id: commentId,
            content,
            createdAt: now,
            updatedAt: now,
            userId: authUser.id,
            articleId: article.id,
            parentId: storeCommentBodySPR.data.parentId,
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                firstName: true,
                profileUrl: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
              },
            },
            /* eslint-disable indent */
            reactions:
              authUser === null
                ? undefined
                : {
                    where: {
                      userId: authUser.id,
                    },
                  },
            /* eslint-enable indent */
            _count: {
              select: {
                replies: {
                  where: {
                    deletedAt: null,
                  },
                },
                reactions: true,
              },
            },
          },
        })
        .then((comment) => {
          if (authUser !== null) {
            const auth: ShowCommentData["comment"]["auth"] = {
              reaction: null,
            };

            if (comment.reactions.length > 0) {
              auth.reaction = comment.reactions[0] as Reaction;
            }

            return {
              ...comment,
              auth,
            };
          } else {
            return {
              ...comment,
              auth: null,
            };
          }
        });

    return StoreCommentDataSchema.parse({
      comment,
    });
  },
);
