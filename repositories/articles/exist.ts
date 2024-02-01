import { type Prisma } from "@prisma/client";
import { count } from "~/repositories/articles/count";

export const exist = ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.ArticleWhereInput;
  orderBy?: Prisma.ArticleOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<boolean> => {
  return count({
    where,
    orderBy,
    skip,
    take,
  }).then((count: number) => count > 0);
};
