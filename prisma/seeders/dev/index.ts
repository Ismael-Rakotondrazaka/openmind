/* eslint-disable no-console */
import {
  PrismaClient,
  type Article,
  type Comment,
  type Tag,
  type User,
} from "@prisma/client";
import { createArticles } from "./articles";
import { createComments } from "./comments";
import { createFollows } from "./follows";
import { createReactions } from "./reactions";
import { createSavedArticles } from "./savedArticles";
import { createTags } from "./tags";
import { createUsers } from "./users";
import { createViews } from "./views";

const prismaClient = new PrismaClient();

const main = async () => {
  console.time("=> Total seed duration");
  const simulationYears: number = 3;

  /* ---------------------------------- Tags ---------------------------------- */
  console.time("Tag seed duration");

  const tags: Tag[] = await createTags({
    prisma: prismaClient,
  });

  console.timeEnd("Tag seed duration");
  /* -------------------------------------------------------------------------- */

  /* ---------------------------------- User ---------------------------------- */
  console.time("User seed duration");

  const users: User[] = await createUsers({
    prisma: prismaClient,
    years: simulationYears,
    tags,
  });

  console.timeEnd("User seed duration");
  /* -------------------------------------------------------------------------- */

  /* --------------------------------- Article -------------------------------- */
  console.time("Article seed duration");

  const articles: Article[] = await createArticles({
    prisma: prismaClient,
    users,
    tags,
  });

  console.timeEnd("Article seed duration");
  /* ---------------------------------- Views --------------------------------- */
  console.time("View seed duration");

  await createViews({
    prisma: prismaClient,
    articles,
    users,
  });

  console.timeEnd("View seed duration");
  /* -------------------------------------------------------------------------- */

  /* -------------------------------- Comments -------------------------------- */
  console.time("Comment seed duration");

  const comments: Comment[] = await createComments({
    prisma: prismaClient,
    articles,
    users,
  });

  console.timeEnd("Comment seed duration");
  /* -------------------------------------------------------------------------- */

  /* -------------------------------- Reactions ------------------------------- */
  console.time("Reaction seed duration");

  await createReactions({
    prisma: prismaClient,
    users,
    articles,
    comments,
  });

  console.timeEnd("Reaction seed duration");
  /* -------------------------------------------------------------------------- */

  /* ----------------------------- Saved Articles ----------------------------- */
  console.time("Saved article seed duration");

  await createSavedArticles({
    prisma: prismaClient,
    articles,
    users,
  });

  console.timeEnd("Saved article seed duration");
  /* -------------------------------------------------------------------------- */

  /* --------------------------------- Follows -------------------------------- */
  console.time("Follows seed duration");

  await createFollows({
    prisma: prismaClient,
    users,
  });

  console.timeEnd("Follows seed duration");
  /* -------------------------------------------------------------------------- */

  console.timeEnd("=> Total seed duration");
};

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prismaClient.$disconnect();

    process.exit(1);
  });
