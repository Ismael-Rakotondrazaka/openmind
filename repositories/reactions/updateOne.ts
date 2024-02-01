import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { type Reaction, ReactionSchema } from "~/utils";

export const updateOne = async ({
  data,
  where,
}: {
  data:
    | (Prisma.Without<
        Prisma.ReactionUpdateInput,
        Prisma.ReactionUncheckedUpdateInput
      > &
        Prisma.ReactionUncheckedUpdateInput)
    | (Prisma.Without<
        Prisma.ReactionUncheckedUpdateInput,
        Prisma.ReactionUpdateInput
      > &
        Prisma.ReactionUpdateInput);
  where: Prisma.ReactionUpdateArgs["where"];
}): Promise<Reaction> => {
  const rawReaction = await prisma.reaction.update({
    where,
    data,
  });

  const parsedReaction: Reaction = ReactionSchema.parse(rawReaction);

  return parsedReaction;
};
