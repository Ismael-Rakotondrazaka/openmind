import { articleConfig } from "~/utils";

export const createArticleSlugSuffix = (): string =>
  createRandomString(articleConfig.SLUG_SUFFIX_LENGTH);
