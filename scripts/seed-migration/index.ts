import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

import { seedConfig } from './input/config.js';
import { seedUsers } from './input/users.js';
import { buildModel } from './lib/build-model.js';
import {
  loadArticlesJson,
  loadCommentsJson,
  loadRepliesJson,
} from './lib/load-json.js';
import { writeAll } from './lib/writers.js';

const OUTPUT_DIR = join(process.cwd(), 'scripts', 'seed-migration', 'output');
const SUPABASE_SEEDS_DIR = join(process.cwd(), 'supabase', 'seeds');

async function main(): Promise<void> {
  const articles = loadArticlesJson();
  const commentsContent = loadCommentsJson();
  const repliesContent = loadRepliesJson();

  const model = buildModel(
    seedUsers,
    seedConfig,
    articles,
    commentsContent,
    repliesContent
  );

  for (const dir of [OUTPUT_DIR, SUPABASE_SEEDS_DIR]) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  writeAll(model, OUTPUT_DIR);
  writeAll(model, SUPABASE_SEEDS_DIR);
  console.log(
    `Seed SQL files written to ${OUTPUT_DIR} and ${SUPABASE_SEEDS_DIR}`
  );
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
