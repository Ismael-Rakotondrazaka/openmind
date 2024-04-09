// export type IndexCommentDI = {
//   comments: Ref<CommentFull[]>;
//   pagination: Ref<Pagination>;
// };

// export const IndexCommentToken = Symbol(
//   "IndexCommentToken",
// ) as InjectionKey<IndexCommentDI>;

export type ArticleCommentDialogDI = {
  isVisible: Ref<boolean>;
};

export const ArticleCommentDialogToken = Symbol(
  "ArticleCommentDialog",
) as InjectionKey<ArticleCommentDialogDI>;
