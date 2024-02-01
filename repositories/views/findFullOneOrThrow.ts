import { type Prisma } from "@prisma/client";
import { findFullOne } from "./findFullOne";
import { type ViewFull } from "~/utils";

export const findFullOneOrThrow = async ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.ViewWhereInput;
  orderBy?: Prisma.ViewOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<ViewFull> => {
  const view: ViewFull | null = await findFullOne({
    where,
    orderBy,
    skip,
    take,
  });

  if (view === null) {
    throw new Error("Not implemented yet");
  }

  return view;
};
