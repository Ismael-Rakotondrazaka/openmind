import { createRandomString } from "~/server/utils/strings";
import { commentConfig } from "~/utils";

export const createCommentId = (): string =>
  createRandomString(commentConfig.ID_LENGTH);
