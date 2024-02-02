import type { Tag, User } from "@prisma/client";
import { tagRepository } from "~/repositories/tags";
import {
  type StoreTagData,
  type StoreTagError,
  createBadRequestError,
  createUnauthorizedError,
  getRequestErrorMessage,
  StoreTagBodySchema,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<StoreTagData | StoreTagError> => {
    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    const storeTagBodySPR = await safeParseRequestBodyAs(
      event,
      StoreTagBodySchema,
    );

    if (!storeTagBodySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(storeTagBodySPR),
      });
    }

    const isDuplicate: boolean = await tagRepository.exist({
      where: {
        value: storeTagBodySPR.data.value,
      },
    });

    if (isDuplicate) {
      return createBadRequestError(event, {
        errorMessage: {
          value: "The tag already exists.",
        },
      });
    }

    const tag: Tag = await tagRepository.createOne({
      data: {
        value: storeTagBodySPR.data.value,
      },
    });

    return {
      tag,
    };
  },
);
