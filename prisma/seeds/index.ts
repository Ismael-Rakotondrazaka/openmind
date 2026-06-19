import { PrismaPg } from '@prisma/adapter-pg';
import { consola } from 'consola';

import { PrismaClient } from '../../prisma/generated/client/client.js';
import { seedCounters } from './_counters';
import { seedComments } from './comments';
import { seedFollows } from './follows';
import { seedPosts } from './posts';
import { seedReactions } from './reactions';
import { seedSavedPosts } from './savedPosts';
import { seedTags } from './tags';
import { seedUsers } from './users';
import { seedUserTags } from './userTags';
import { seedViews } from './views';

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: pool });

const main = async () => {
  consola.start('Seeding database…');

  consola.info('Seeding users & identities…');
  await seedUsers(prisma);

  consola.info('Seeding tags…');
  await seedTags(prisma);

  consola.info('Seeding posts & post tags…');
  await seedPosts(prisma);

  consola.info('Seeding user tags…');
  await seedUserTags(prisma);

  consola.info('Seeding comments…');
  await seedComments(prisma);

  consola.info('Seeding reactions…');
  await seedReactions(prisma);

  consola.info('Seeding follows…');
  await seedFollows(prisma);

  consola.info('Seeding views…');
  await seedViews(prisma);

  consola.info('Seeding saved posts…');
  await seedSavedPosts(prisma);

  consola.info('Updating counters…');
  await seedCounters(prisma);

  consola.success('Database seeded successfully.');
};

main()
  .catch(async e => {
    consola.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
