import type { User } from "@prisma/client";
import { tagRepository } from "~/repositories/tags";
import type { IndexUserTagData, IndexUserTagError } from "~/utils";

export default defineEventHandler(
  async (event): Promise<IndexUserTagData | IndexUserTagError> => {
    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    const tags: IndexUserTagData["tags"] = await tagRepository.findMany({
      where: {
        users: {
          some: {
            id: authUser.id,
          },
        },
      },
    });

    return {
      tags,
    };
  },
);
