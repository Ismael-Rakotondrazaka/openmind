import type { UseWebSocketReturn } from "@vueuse/core";

export type WSCommentDI = UseWebSocketReturn<unknown>;

export const WSCommentToken = Symbol(
  "WSCommentToken",
) as InjectionKey<WSCommentDI>;
