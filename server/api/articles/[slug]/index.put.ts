import type { SafeParseError, SafeParseReturnType } from "zod";
import type { Article, User } from "@prisma/client";
import slugify from "slugify";
import {
  type UpdateArticleData,
  type UpdateArticleError,
  type StoreArticleBody,
  type UpdateArticleParam,
  createBadRequestError,
  createUnauthorizedError,
  getRequestErrorMessage,
  updateArticleParamSchema,
} from "~/utils";
import {
  createArticleSlugSuffix,
  formatArticleContent,
  getAuthUser,
  safeParseRequestBodyAs,
  updateArticleBodySchema,
} from "~/server/utils";

export default defineEventHandler(
  async (event): Promise<UpdateArticleData | UpdateArticleError> => {
    const updateArticleParamSPR: SafeParseReturnType<
      UpdateArticleParam,
      UpdateArticleParam
    > = await safeParseRequestParamAs(event, updateArticleParamSchema);

    if (!updateArticleParamSPR.success) {
      return createNotFoundError(event);
    }

    const article: Article | null =
      await event.context.prisma.article.findFirst({
        where: {
          slug: updateArticleParamSPR.data.slug,
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
      updateArticleBodySchema,
    );

    if (!updateArticleBodySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(
          updateArticleBodySPR as SafeParseError<StoreArticleBody>,
        ),
      });
    }

    let newTitle: string | undefined;
    if (updateArticleBodySPR.data.title !== undefined) {
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

    let newSummary: string | null | undefined =
      updateArticleBodySPR.data.summary;
    if (newSummary !== null && newSummary !== undefined) {
      newSummary = sanitize(newSummary);
    }

    let newIsVisible: boolean | undefined;
    if (updateArticleBodySPR.data.isVisible !== undefined) {
      newIsVisible = updateArticleBodySPR.data.isVisible;
    }

    let newContent: string | undefined;
    if (updateArticleBodySPR.data.content !== undefined) {
      const { content, filesToUpload } = formatArticleContent(
        updateArticleBodySPR.data.content,
        article.id,
      );

      newContent = content;

      deleteFolder(`public/articles/${article.id}`).finally(() =>
        Promise.allSettled(filesToUpload.map(uploadFileFromBase64)),
      );
    }

    const updatedArticle: Article & {
      user: Omit<User, "password" | "email" | "emailVerifiedAt">;
    } = await event.context.prisma.article.update({
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
      },
    });

    return {
      article: updatedArticle,
    };
  },
);
