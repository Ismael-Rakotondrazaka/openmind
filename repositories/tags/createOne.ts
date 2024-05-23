import { type Prisma, type Tag } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { TagSchema } from "~/prisma/generated/zod";

export const createOne = async ({
  data,
}: {
  data:
    | (Prisma.Without<Prisma.TagCreateInput, Prisma.TagUncheckedCreateInput> &
        Prisma.TagUncheckedCreateInput)
    | (Prisma.Without<Prisma.TagUncheckedCreateInput, Prisma.TagCreateInput> &
        Prisma.TagCreateInput);
}): Promise<Tag> => {
  const rawTag = await prisma.tag.create({
    data,
  });

  const parsedTag: Tag = TagSchema.parse(rawTag);

  return parsedTag;
};
