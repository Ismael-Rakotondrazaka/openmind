import type { User } from "@prisma/client";
import {
  type StoreArticleData,
  type StoreArticleError,
  createBadRequestError,
  createUnauthorizedError,
  getRequestErrorMessage,
  articleConfig,
  StoreArticleDataSchema,
} from "~/utils";
import {
  createArticleId,
  formatArticleContent,
  getAuthUser,
  slugify,
  StoreArticleBodySchema,
} from "~/server/utils";
import { articleRepository } from "~/repositories";
import { tagRepository } from "~/repositories/tags";

export default defineEventHandler(
  async (event): Promise<StoreArticleData | StoreArticleError> => {
    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    const storeArticleBodySPR = await safeParseRequestBodyAs(
      event,
      StoreArticleBodySchema,
    );

    if (!storeArticleBodySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(storeArticleBodySPR),
      });
    }

    const tagsCount: number = await tagRepository.count({
      where: {
        id: {
          in: storeArticleBodySPR.data.tagIds,
        },
      },
    });
    if (tagsCount !== storeArticleBodySPR.data.tagIds.length) {
      return createBadRequestError(event, {
        errorMessage: {
          tagIds: "One or more tags do not exist.",
        },
      });
    }

    const title: string = sanitize(storeArticleBodySPR.data.title);

    let slug: string = slugify(title);

    const isDuplicate: boolean = await articleRepository.exist({
      where: {
        slug,
      },
    });

    if (isDuplicate) {
      slug += `-${createRandomString(articleConfig.SLUG_SUFFIX_LENGTH)}`;
    }

    const articleId: string = createArticleId();
    const now: Date = new Date();

    let summary: string | null | undefined = storeArticleBodySPR.data.summary;
    if (summary !== null && summary !== undefined) {
      summary = sanitize(summary);
    }

    const { content, filesToUpload } = formatArticleContent(
      storeArticleBodySPR.data.content,
      articleId,
    );

    Promise.allSettled(filesToUpload.map(saveFileFromBase64));

    let coverUrl: string | null | undefined;
    if (storeArticleBodySPR.data.cover === null) {
      coverUrl = null;
    } else if (storeArticleBodySPR.data.cover !== undefined) {
      coverUrl = uploadArticleCover({
        file: storeArticleBodySPR.data.cover,
        articleId,
      });
    }

    const article: StoreArticleData["article"] =
      await articleRepository.createFullOne({
        data: {
          id: articleId,
          content,
          title,
          slug,
          createdAt: now,
          updatedAt: now,
          isVisible: storeArticleBodySPR.data.isVisible,
          summary,
          userId: authUser.id,
          coverUrl,
          tags: {
            connect: storeArticleBodySPR.data.tagIds.map((tagId: number) => ({
              id: tagId,
            })),
          },
        },
        authUser,
      });

    return StoreArticleDataSchema.parse({
      article,
    });
  },
);
