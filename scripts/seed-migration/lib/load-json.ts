import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { ArticleJson, CommentContentJson } from './types.js';

const DATA_MIGRATION_OUTPUT = join(
  process.cwd(),
  'scripts',
  'data-migration',
  'output'
);

export function loadArticlesJson(): ArticleJson[] {
  const path = join(DATA_MIGRATION_OUTPUT, 'articles.json');
  const raw = readFileSync(path, 'utf-8');
  return JSON.parse(raw) as ArticleJson[];
}

export function loadCommentsJson(): CommentContentJson[] {
  const path = join(DATA_MIGRATION_OUTPUT, 'comments.json');
  const raw = readFileSync(path, 'utf-8');
  return JSON.parse(raw) as CommentContentJson[];
}

export function loadRepliesJson(): CommentContentJson[] {
  const path = join(DATA_MIGRATION_OUTPUT, 'replies.json');
  const raw = readFileSync(path, 'utf-8');
  return JSON.parse(raw) as CommentContentJson[];
}
