import type { OutputData } from '@editorjs/editorjs';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { htmlToEditorJsOutput } from './html-to-editorjs';
import { articlesData, commentsData, repliesData } from './input/data';

type ArticleData = {
  content: string;
  coverUrl: string;
  summary: string;
  tags: string[];
  title: string;
};

type MigratedArticleData = { content: OutputData } & Omit<
  ArticleData,
  'content'
>;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, 'output');

const migratedArticles: MigratedArticleData[] = articlesData.map(article => ({
  ...article,
  content: htmlToEditorJsOutput(article.content),
}));

const migratedComments: OutputData[] = commentsData.map(html =>
  htmlToEditorJsOutput(html)
);

const migratedReplies: OutputData[] = repliesData.map(html =>
  htmlToEditorJsOutput(html)
);

fs.mkdirSync(outputDir, { recursive: true });

const articlesPath = path.join(outputDir, 'articles.json');
const commentsPath = path.join(outputDir, 'comments.json');
const repliesPath = path.join(outputDir, 'replies.json');

fs.writeFileSync(
  articlesPath,
  JSON.stringify(migratedArticles, null, 2),
  'utf-8'
);
fs.writeFileSync(
  commentsPath,
  JSON.stringify(migratedComments, null, 2),
  'utf-8'
);
fs.writeFileSync(
  repliesPath,
  JSON.stringify(migratedReplies, null, 2),
  'utf-8'
);

console.log(
  `Migrated ${migratedArticles.length} articles, ${migratedComments.length} comments, ${migratedReplies.length} replies to ${outputDir}`
);
