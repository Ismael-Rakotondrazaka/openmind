import { type Prisma } from "@prisma/client";
import { count } from "~/repositories/savedArticles/count";

export const exist = ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.SavedArticleWhereInput;
  orderBy?: Prisma.SavedArticleOrderByWithRelationInput;
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
