import { z } from "zod";
import { CommentFullSchema } from "~/schemas/globalSchemas/comments/comment";

export const WSCommentQuerySchema = z.object({
  articleId: z.string(),
});

export type WSCommentQuery = z.infer<typeof WSCommentQuerySchema>;

export const WSCommentMessageEventTypeSchema = z.enum([
  "store",
  "update",
  "destroy",
]);
export type WSCommentMessageEventType = z.infer<
  typeof WSCommentMessageEventTypeSchema
>;

export const WSCommentBodySchema = z.object({
  commentId: z.string(),
  userId: z.coerce.number(),
  eventType: WSCommentMessageEventTypeSchema,
});

export type WSCommentBody = z.infer<typeof WSCommentBodySchema>;

export const WSCommentDataSchema = z.object({
  eventType: WSCommentMessageEventTypeSchema,
  comment: CommentFullSchema,
});

export type WSCommentData = z.infer<typeof WSCommentDataSchema>;
