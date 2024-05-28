export type IndexReactionDI = {
  reactions: Ref<ReactionFull[]>;
  pagination: Ref<Pagination>;
};

export const IndexReactionToken = Symbol(
  "IndexReactionToken",
) as InjectionKey<IndexReactionDI>;

export type ArticleReactionSidebarDI = {
  isVisible: Ref<boolean>;
};

export const ArticleReactionSidebarToken = Symbol(
  "ArticleReactionSidebar",
) as InjectionKey<ArticleReactionSidebarDI>;
