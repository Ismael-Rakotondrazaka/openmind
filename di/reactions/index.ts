export type IndexReactionDI = {
  reactions: Ref<ReactionFull[]>;
  pagination: Ref<Pagination>;
};

export const IndexReactionToken = Symbol(
  "IndexReactionToken",
) as InjectionKey<IndexReactionDI>;
