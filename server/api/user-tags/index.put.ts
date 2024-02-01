import type { Tag, User } from "@prisma/client";
import { tagRepository } from "~/repositories/tags";
import {
  type UpdateUserTagData,
  type UpdateUserTagError,
  createBadRequestError,
  createUnauthorizedError,
  getRequestErrorMessage,
  UpdateUserTagBodySchema,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<UpdateUserTagData | UpdateUserTagError> => {
    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    const updateUserTagBodySPR = await safeParseRequestBodyAs(
      event,
      UpdateUserTagBodySchema,
    );

    if (!updateUserTagBodySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(updateUserTagBodySPR),
      });
    }

    const oldTags: Tag[] = await tagRepository.findMany({
      where: {
        users: {
          every: {
            id: authUser.id,
          },
        },
      },
    });

    const newTags: Tag[] = await tagRepository.findMany({
      where: {
        id: {
          in: updateUserTagBodySPR.data.tagIds,
        },
      },
    });

    if (newTags.length !== updateUserTagBodySPR.data.tagIds.length) {
      return createBadRequestError(event, {
        errorMessage: {
          tagIds: "One or more tags do not exist.",
        },
      });
    }

    // Check if one change is made
    if (
      oldTags.every((tag: Tag) => {
        if (updateUserTagBodySPR.data.tagIds !== undefined) {
          return updateUserTagBodySPR.data.tagIds.includes(tag.id);
        } else {
          return false;
        }
      }) &&
      oldTags.length === updateUserTagBodySPR.data.tagIds.length
    ) {
      return createBadRequestError(event, {
        message: "At least one change is required.",
        errorMessage: {},
      });
    }

    const oldTagIdsSet: Set<number> = new Set(
      oldTags.map((val: Tag) => val.id),
    );
    const newTagIdsSet: Set<number> = new Set(updateUserTagBodySPR.data.tagIds);

    const tagsToDisconnect: { id: number }[] = [];
    const tagsToConnect: { id: number }[] = [];

    oldTags.forEach((val: Tag) => {
      if (!newTagIdsSet.has(val.id)) {
        tagsToDisconnect.push({ id: val.id });
      }
    });

    updateUserTagBodySPR.data.tagIds.forEach((id: number) => {
      if (!oldTagIdsSet.has(id)) {
        tagsToConnect.push({ id });
      }
    });

    return {
      tags: newTags,
    };
  },
);
