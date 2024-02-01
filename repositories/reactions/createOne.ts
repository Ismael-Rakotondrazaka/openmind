import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { type Reaction, ReactionSchema } from "~/utils";

export const createOne = async ({
  data,
}: {
  data:
    | (Prisma.Without<
        Prisma.ReactionCreateInput,
        Prisma.ReactionUncheckedCreateInput
      > &
        Prisma.ReactionUncheckedCreateInput)
    | (Prisma.Without<
        Prisma.ReactionUncheckedCreateInput,
        Prisma.ReactionCreateInput
      > &
        Prisma.ReactionCreateInput);
}): Promise<Reaction> => {
  const rawReaction = await prisma.reaction.create({
    data,
  });

  const parsedReaction: Reaction = ReactionSchema.parse(rawReaction);

  return parsedReaction;
};
