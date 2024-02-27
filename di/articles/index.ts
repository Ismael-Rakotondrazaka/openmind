export type ShowArticleDI = {
  article: Ref<ShowArticleData["article"]>;
};

export const ShowArticleToken = Symbol(
  "ShowArticleToken",
) as InjectionKey<ShowArticleDI>;
