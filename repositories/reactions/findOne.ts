import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { type Reaction, ReactionSchema } from "~/utils";

export const findOne = async ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.ReactionWhereInput;
  orderBy?: Prisma.ReactionOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<Reaction | null> => {
  const rawReaction = await prisma.reaction.findFirst({
    where,
    orderBy,
    skip,
    take,
  });

  let parsedReaction: Reaction | null = null;

  if (rawReaction !== null) {
    parsedReaction = ReactionSchema.parse(rawReaction);
  }

  return parsedReaction;
};
