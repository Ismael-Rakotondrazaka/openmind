import { zfd } from "zod-form-data";
import type { SafeParseError } from "zod";
import type { Article, User } from "@prisma/client";
import {
  type StoreArticleData,
  type StoreArticleError,
  type StoreArticleBody,
  createBadRequestError,
  createUnauthorizedError,
  getRequestErrorMessage,
  articleConfig,
} from "~/utils";
import {
  createArticleId,
  formatArticleContent,
  getAuthUser,
  slugify,
  StoreArticleBodySchema,
} from "~/server/utils";

export default defineEventHandler(
  async (event): Promise<StoreArticleData | StoreArticleError> => {
    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    const requestBody: unknown = await getRequestBody(event);

    const storeArticleBodySPR = await zfd
      .formData(StoreArticleBodySchema)
      .safeParseAsync(requestBody);

    if (!storeArticleBodySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(
          storeArticleBodySPR as SafeParseError<StoreArticleBody>,
        ),
      });
    }

    const title: string = sanitize(storeArticleBodySPR.data.title);

    let slug: string = slugify(title);

    const isDuplicate: boolean = await event.context.prisma.article
      .count({
        where: {
          slug,
        },
      })
      .then((count: number) => count > 0);

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

    const article: Article & {
      user: Omit<User, "password" | "email" | "emailVerifiedAt">;
    } = await event.context.prisma.article.create({
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
      article,
    };
  },
);
