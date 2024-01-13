import type { Tag, User } from "@prisma/client";
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

    const isDuplicate: boolean = await event.context.prisma.tag
      .count({
        where: {
          value: storeTagBodySPR.data.value,
        },
      })
      .then((count: number) => count > 0);

    if (isDuplicate) {
      return createBadRequestError(event, {
        errorMessage: {
          value: "The tag already exists.",
        },
      });
    }

    const tag: Tag = await event.context.prisma.tag.create({
      data: {
        value: storeTagBodySPR.data.value,
      },
    });

    return {
      tag,
    };
  },
);
