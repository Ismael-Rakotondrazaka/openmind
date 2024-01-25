import type { Comment, User } from "@prisma/client";
import {
  type UpdateCommentData,
  type UpdateCommentError,
  createBadRequestError,
  createUnauthorizedError,
  createNotFoundError,
  createForbiddenError,
  getRequestErrorMessage,
  UpdateCommentParamSchema,
  UpdateCommentDataSchema,
} from "~/utils";
import { UpdateCommentBodySchema } from "~/server/utils";

export default defineEventHandler(
  async (event): Promise<UpdateCommentData | UpdateCommentError> => {
    const updateCommentParamSPR = await safeParseRequestParamAs(
      event,
      UpdateCommentParamSchema,
    );

    if (!updateCommentParamSPR.success) {
      return createNotFoundError(event);
    }

    const comment: Comment | null =
      await event.context.prisma.comment.findFirst({
        where: {
          id: updateCommentParamSPR.data.id,
        },
      });

    if (comment === null) {
      return createNotFoundError(event);
    }

    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    if (authUser.id !== comment.userId) {
      return createForbiddenError(event);
    }

    const updateCommentBodySPR = await safeParseRequestBodyAs(
      event,
      UpdateCommentBodySchema,
    );

    if (!updateCommentBodySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(updateCommentBodySPR),
      });
    }

    // Check if one change is made
    if (
      !(
        updateCommentBodySPR.data.content !== undefined &&
        updateCommentBodySPR.data.content !== comment.content
      )
    ) {
      return createBadRequestError(event, {
        message: "At least one change is required.",
        errorMessage: {},
      });
    }

    const now: Date = new Date();

    let newContent: string | undefined;
    if (
      updateCommentBodySPR.data.content !== undefined &&
      updateCommentBodySPR.data.content !== comment.content
    ) {
      const { content, filesToSave, fileUrlsToExclude } = formatCommentContent(
        updateCommentBodySPR.data.content,
        comment.id,
      );

      newContent = content;

      deleteFilesInFolder({
        folderPath: `public/comments/${comment.id}/illustrations`,
        excludes: fileUrlsToExclude,
      }).finally(() => Promise.allSettled(filesToSave.map(saveUploadedFile)));
    }

    const updatedComment: UpdateCommentData["comment"] =
      await event.context.prisma.comment
        .update({
          where: {
            id: comment.id,
          },
          data: {
            content: newContent,
            updatedAt: now,
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
            const auth: UpdateCommentData["comment"]["auth"] = {
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

    return UpdateCommentDataSchema.parse({
      comment: updatedComment,
    });
  },
);
