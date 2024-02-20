import { z } from "zod";
import { articleConfig } from "~/configs";
import { countHtmlAsTextLength } from "~/utils/strings";
import { ArticleFullSchema } from "~/schemas/globalSchemas/articles/article";
import { FileSchema } from "~/schemas/globalSchemas/files";

/* -------------------------------------------------------------------------- */
/*                            Update article param                            */
/* -------------------------------------------------------------------------- */

export const UpdateArticleParamSchema = z.object({
  slug: z.string().trim(),
});

export type UpdateArticleParam = z.infer<typeof UpdateArticleParamSchema>;

/* -------------------------------------------------------------------------- */
/*                             Update article body                            */
/* -------------------------------------------------------------------------- */

export const UpdateArticleBodyBaseSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(articleConfig.TITLE_MIN_LENGTH)
      .max(articleConfig.TITLE_MAX_LENGTH),
  })
  .partial();

export const UpdateArticleBodyClientSchema = UpdateArticleBodyBaseSchema.merge(
  z
    .object({
      summary: z
        .string()
        .trim()
        .transform((value: string, ctx): string => {
          if (value.length < articleConfig.SUMMARY_MIN_LENGTH) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_small,
              minimum: articleConfig.SUMMARY_MIN_LENGTH,
              inclusive: true,
              type: "string",
            });

            return z.NEVER;
          } else if (value.length > articleConfig.SUMMARY_MAX_LENGTH) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_big,
              maximum: articleConfig.SUMMARY_MIN_LENGTH,
              inclusive: true,
              type: "string",
            });

            return z.NEVER;
          }

          return value;
        })
        .nullable(),
      isVisible: z.boolean().default(articleConfig.IS_VISIBLE_DEFAULT_VALUE),
      tagIds: z
        .array(z.coerce.number().int().positive())
        .min(1)
        .max(articleConfig.TAGS_MAX_SIZE)
        .refine((val: number[]) => val.length === [...new Set(val)].length, {
          message: "Tags must be unique",
        }),
      content: z
        .string()
        .trim()
        .superRefine((value: string, ctx) => {
          const parser = new DOMParser();
          const document = parser.parseFromString(value, "text/html");
          const body = document.body;

          const length: number = countHtmlAsTextLength(body);

          if (length < articleConfig.CONTENT_MIN_LENGTH) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_small,
              minimum: articleConfig.CONTENT_MIN_LENGTH,
              inclusive: true,
              fatal: true,
              type: "string",
            });

            return z.NEVER;
          }

          if (length > articleConfig.CONTENT_MAX_LENGTH) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_big,
              fatal: true,
              maximum: articleConfig.CONTENT_MAX_LENGTH,
              inclusive: true,
              type: "string",
            });

            return z.NEVER;
          }
        }),
      cover: FileSchema.nullable(),
    })
    .partial(),
);

export type UpdateArticleBody = z.infer<typeof UpdateArticleBodyClientSchema>;

export type UpdateArticleBodyPEM = RequestErrorMessage<UpdateArticleBody>;

/* -------------------------------------------------------------------------- */
/*                             Update article data                            */
/* -------------------------------------------------------------------------- */

export const UpdateArticleDataSchema = z.object({
  article: ArticleFullSchema,
});

export type UpdateArticleData = z.infer<typeof UpdateArticleDataSchema>;

export type UpdateArticleError =
  | BadRequestError<UpdateArticleBodyPEM>
  | UnauthorizedError
  | ForbiddenError
  | NotFoundError;
