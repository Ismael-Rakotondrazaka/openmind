import type { Session } from "next-auth";
import type { H3Event, EventHandlerRequest } from "h3";
import type { User } from "@prisma/client";
import { getServerSession } from "#auth";
import { userRepository } from "~/repositories";

export const getAuthUser = async (
  event: H3Event<EventHandlerRequest>,
): Promise<null | User> => {
  const session: Session | null = await getServerSession(event);

  if (session === null) return null;

  const id: number | undefined =
    (session.user as { id: number | undefined | null })?.id ?? undefined;
  let authAdmin: User | null = null;

  if (id !== undefined) {
    authAdmin = await userRepository.findOne({
      where: {
        AND: {
          id,
          deletedAt: null,
        },
      },
    });
  }

  return authAdmin;
};
