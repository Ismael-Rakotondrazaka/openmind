import type { SafeParseError, SafeParseReturnType } from "zod";
import type { Article, Tag, User } from "@prisma/client";
import {
  type UpdateArticleData,
  type UpdateArticleError,
  type StoreArticleBody,
  type UpdateArticleParam,
  createBadRequestError,
  createUnauthorizedError,
  createNotFoundError,
  createForbiddenError,
  getRequestErrorMessage,
  UpdateArticleParamSchema,
  UpdateArticleDataSchema,
  type Reaction,
} from "~/utils";
import {
  createArticleSlugSuffix,
  formatArticleContent,
  getAuthUser,
  safeParseRequestBodyAs,
  UpdateArticleBodySchema,
  slugify,
} from "~/server/utils";

export default defineEventHandler(
  async (event): Promise<UpdateArticleData | UpdateArticleError> => {
    const updateArticleParamSPR: SafeParseReturnType<
      UpdateArticleParam,
      UpdateArticleParam
    > = await safeParseRequestParamAs(event, UpdateArticleParamSchema);

    if (!updateArticleParamSPR.success) {
      return createNotFoundError(event);
    }

    let article:
      | (Article & {
          tags: Tag[];
        })
      | null = null;
    article = await event.context.prisma.article.findFirst({
      where: {
        slug: updateArticleParamSPR.data.slug,
      },
      include: {
        tags: true,
      },
    });

    if (article === null) {
      return createNotFoundError(event);
    }

    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    if (authUser.id !== article.userId) {
      return createForbiddenError(event);
    }

    const updateArticleBodySPR = await safeParseRequestBodyAs(
      event,
      UpdateArticleBodySchema,
    );

    if (!updateArticleBodySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(
          updateArticleBodySPR as SafeParseError<StoreArticleBody>,
        ),
      });
    }

    // Check if one change is made
    if (
      !(
        (updateArticleBodySPR.data.content !== undefined &&
          updateArticleBodySPR.data.content !== article.content) ||
        (updateArticleBodySPR.data.title !== undefined &&
          updateArticleBodySPR.data.title !== article.title) ||
        (updateArticleBodySPR.data.summary !== undefined &&
          updateArticleBodySPR.data.summary !== article.summary) ||
        (updateArticleBodySPR.data.isVisible !== undefined &&
          updateArticleBodySPR.data.isVisible !== article.isVisible) ||
        (updateArticleBodySPR.data.cover !== undefined &&
          updateArticleBodySPR.data.cover !== article.coverUrl) ||
        (updateArticleBodySPR.data.tagIds !== undefined &&
          !(
            article.tags.every((tag: Tag) => {
              if (updateArticleBodySPR.data.tagIds !== undefined) {
                return updateArticleBodySPR.data.tagIds.includes(tag.id);
              } else {
                return false;
              }
            }) &&
            article.tags.length === updateArticleBodySPR.data.tagIds.length
          ))
      )
    ) {
      return createBadRequestError(event, {
        message: "At least one change is required.",
        errorMessage: {},
      });
    }

    let newTags: Tag[] = [];
    if (updateArticleBodySPR.data.tagIds !== undefined) {
      newTags = await event.context.prisma.tag.findMany({
        where: {
          id: {
            in: updateArticleBodySPR.data.tagIds,
          },
        },
      });

      if (newTags.length !== updateArticleBodySPR.data.tagIds.length) {
        return createBadRequestError(event, {
          errorMessage: {
            tagIds: "One or more tags do not exist.",
          },
        });
      }
    }

    let newTitle: string | undefined;
    if (
      updateArticleBodySPR.data.title !== undefined &&
      updateArticleBodySPR.data.title !== article.title
    ) {
      newTitle = sanitize(updateArticleBodySPR.data.title);
    }

    let newSlug: string | undefined;
    if (newTitle !== undefined) {
      newSlug = slugify(newTitle);

      const isDuplicate: boolean = await event.context.prisma.article
        .count({
          where: {
            slug: newSlug,
          },
        })
        .then((count: number) => count > 0);

      if (isDuplicate) {
        newSlug += `-${createArticleSlugSuffix()}`;
      }
    }

    const now: Date = new Date();

    let newSummary: string | null | undefined;
    if (
      updateArticleBodySPR.data.summary !== undefined &&
      updateArticleBodySPR.data.summary !== article.summary
    ) {
      if (updateArticleBodySPR.data.summary === null) {
        newSummary = updateArticleBodySPR.data.summary;
      } else {
        newSummary = sanitize(updateArticleBodySPR.data.summary);
      }
    }

    let newIsVisible: boolean | undefined;
    if (
      updateArticleBodySPR.data.isVisible !== undefined &&
      updateArticleBodySPR.data.isVisible !== article.isVisible
    ) {
      newIsVisible = updateArticleBodySPR.data.isVisible;
    }

    let newContent: string | undefined;
    if (
      updateArticleBodySPR.data.content !== undefined &&
      updateArticleBodySPR.data.content !== article.content
    ) {
      const { content, filesToUpload, fileUrlsToExclude } =
        formatArticleContent(updateArticleBodySPR.data.content, article.id);

      newContent = content;

      deleteFilesInFolder({
        folderPath: `public/articles/${article.id}/illustrations`,
        excludes: fileUrlsToExclude,
      }).finally(() =>
        Promise.allSettled(filesToUpload.map(saveFileFromBase64)),
      );
    }

    let newCoverUrl: string | null | undefined;
    if (updateArticleBodySPR.data.cover === null) {
      newCoverUrl = null;
      deleteFilesInFolder({
        folderPath: `public/articles/${article.id}/cover`,
      });
    } else if (updateArticleBodySPR.data.cover !== undefined) {
      newCoverUrl = uploadArticleCover({
        file: updateArticleBodySPR.data.cover,
        articleId: article.id,
      });
    }

    const oldTagIdsSet: Set<number> = new Set(
      article.tags.map((val: Tag) => val.id),
    );
    const newTagIdsSet: Set<number> = new Set(
      newTags.map((val: Tag) => val.id),
    );

    const tagsToDisconnect: { id: number }[] = [];
    const tagsToConnect: { id: number }[] = [];

    article.tags.forEach((val: Tag) => {
      if (!newTagIdsSet.has(val.id)) {
        tagsToDisconnect.push({ id: val.id });
      }
    });

    newTags.forEach((val: Tag) => {
      if (!oldTagIdsSet.has(val.id)) {
        tagsToConnect.push({ id: val.id });
      }
    });

    const updatedArticle: UpdateArticleData["article"] =
      await event.context.prisma.article
        .update({
          where: {
            id: article.id,
          },
          data: {
            content: newContent,
            title: newTitle,
            slug: newSlug,
            updatedAt: now,
            isVisible: newIsVisible,
            summary: newSummary,
            coverUrl: newCoverUrl,
            tags: {
              connect: tagsToConnect,
              disconnect: tagsToDisconnect,
            },
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
            tags: true,
            savedArticles: {
              where: {
                userId: authUser.id,
              },
            },
            views: {
              where: {
                userId: authUser.id,
              },
            },
            reactions: {
              where: {
                userId: authUser.id,
              },
            },
            _count: {
              select: {
                comments: {
                  where: {
                    deletedAt: null,
                  },
                },
                reactions: true,
                tags: true,
                views: true,
              },
            },
          },
        })
        .then((article) => {
          const auth: StoreArticleData["article"]["auth"] = {
            savedArticle: null,
            view: null,
            reaction: null,
          };

          if (article.savedArticles.length > 0) {
            auth.savedArticle = article.savedArticles[0];
          }

          if (article.views.length > 0) {
            auth.view = article.views[0];
          }

          if (article.reactions.length > 0) {
            auth.reaction = article.reactions[0] as Reaction;
          }

          return {
            ...article,
            auth,
          };
        });

    return UpdateArticleDataSchema.parse({
      article: updatedArticle,
    });
  },
);
