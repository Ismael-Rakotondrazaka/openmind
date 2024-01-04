import { createRandomString } from "~/server/utils/strings";
import { articleConfig } from "~/utils";

export const createArticleId = (): string =>
  createRandomString(articleConfig.ID_LENGTH);
