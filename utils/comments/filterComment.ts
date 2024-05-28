import { type Comment } from "@prisma/client";

export const filterComment = <T>(data: T & Comment): Comment => {
  return {
    articleId: data.articleId,
    parentId: data.parentId,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    deletedAt: data.deletedAt,
    content: data.content,
    id: data.id,
    userId: data.userId,
  };
};
