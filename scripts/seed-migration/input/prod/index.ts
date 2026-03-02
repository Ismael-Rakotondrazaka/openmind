import type { Tag, User } from '@prisma/client';

import { PrismaClient } from '@prisma/client';

import { createArticles } from './articles';
import { articlesData, uniqueTagsData } from './data';
import { createFollows } from './follows';
import { createTags } from './tags';
import { createUsers } from './users';

const prismaClient = new PrismaClient();

const main = async () => {
  console.time('=> Total seed duration');

  const simulationYears: number = 1;

  /* ---------------------------------- Tags ---------------------------------- */
  console.time('Tag seed duration');

  const tags: Tag[] = await createTags({
    prisma: prismaClient,
    values: uniqueTagsData,
  });

  console.timeEnd('Tag seed duration');
  /* -------------------------------------------------------------------------- */

  /* ---------------------------------- User ---------------------------------- */
  console.time('User seed duration');

  const users: User[] = await createUsers({
    prisma: prismaClient,
    tags,
    years: simulationYears,
  });

  console.timeEnd('User seed duration');
  /* -------------------------------------------------------------------------- */

  /* --------------------------------- Follow --------------------------------- */
  console.time('Follow seed duration');

  await createFollows({
    prisma: prismaClient,
    users,
  });

  console.timeEnd('Follow seed duration');
  /* -------------------------------------------------------------------------- */

  /* --------------------------------- Article -------------------------------- */
  console.time('Article seed duration');

  await createArticles({
    data: articlesData,
    prisma: prismaClient,
    tags,
    users,
  });

  console.timeEnd('Article seed duration');
  /* -------------------------------------------------------------------------- */

  console.timeEnd('=> Total seed duration');
};

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })

  .catch(async e => {
    console.error(e);

    await prismaClient.$disconnect();

    process.exit(1);
  });
