export const filterReaction = <T>(data: T & Reaction): Reaction => {
  return {
    articleId: data.articleId,
    commentId: data.commentId,
    createdAt: data.createdAt,
    id: data.id,
    type: data.type,
    userId: data.userId,
  } as Reaction;
};
