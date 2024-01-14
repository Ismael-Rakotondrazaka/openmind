import type { User } from "@prisma/client";
import type { IndexUserTagData, IndexUserTagError } from "~/utils";

export default defineEventHandler(
  async (event): Promise<IndexUserTagData | IndexUserTagError> => {
    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    const tags: IndexUserTagData["tags"] =
      await event.context.prisma.tag.findMany({
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
