import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { BuiltModel } from './build-model.js';

import { INSTANCE_ID } from './build-model.js';
import { escapeSqlString } from './sql.js';

const OUTPUT_DIR = join(process.cwd(), 'scripts', 'seed-migration', 'output');

export function writeAuthIdentities(model: BuiltModel): string {
  const values = model.users.map(
    u =>
      `  (${quote(u.id)}, ${quote(u.id)}, ${quote(JSON.stringify({ email: u.email, sub: u.id }))}::jsonb, 'email', ${quote(u.id)}, now(), ${quoteTs(u.created_at)}, ${quoteTs(u.updated_at)})`
  );
  return `-- Seed: auth.identities\nINSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at) VALUES\n${values.join(',\n')};`;
}

export function writeAuthUsers(model: BuiltModel): string {
  const values = model.users.map(
    u =>
      `  (${quote(INSTANCE_ID)}, ${quote(u.id)}, 'authenticated', 'authenticated', ${quote(u.email)}, extensions.crypt('password123', extensions.gen_salt('bf'::text)), now(), now(), now(), '{"provider":"email","providers":["email"]}', ${quote(JSON.stringify({ first_name: u.first_name, last_name: u.last_name, username: u.username }))}::jsonb, now(), now(), '', '', '', '')`
  );
  return `-- Seed: auth.users (password: password123)\nINSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token) VALUES\n${values.join(',\n')};`;
}

export function writeComments(model: BuiltModel): string {
  const values = model.comments.map(
    c =>
      `  (${quote(c.id)}, ${quote(c.content)}, ${c.parent_id ? quote(c.parent_id) : 'NULL'}, ${c.depth}, ${quote(c.author_id)}, ${quote(c.post_id)}, ${quoteTs(c.created_at)}, ${quoteTs(c.updated_at)})`
  );
  return `-- Seed: public.comments\nINSERT INTO public.comments (id, content, parent_id, depth, author_id, post_id, created_at, updated_at) VALUES\n${values.join(',\n')};`;
}

export function writeFollows(model: BuiltModel): string {
  const values = model.follows.map(
    f =>
      `  (${quote(f.id)}, ${quote(f.follower_id)}, ${quote(f.following_id)}, ${quoteTs(f.created_at)})`
  );
  return `-- Seed: public.follows\nINSERT INTO public.follows (id, follower_id, following_id, created_at) VALUES\n${values.join(',\n')};`;
}

export function writePosts(model: BuiltModel): string {
  const values = model.posts.map(
    p =>
      `  (${quote(p.id)}, ${quote(p.title)}, ${quote(p.slug)}, ${quote(p.author_id)}, ${p.cover_url ? quote(p.cover_url) : 'NULL'}, '${escapeJsonForSql(p.content)}'::jsonb, ${quote(p.status)}, ${quoteTs(p.created_at)}, ${quoteTs(p.updated_at)})`
  );
  return `-- Seed: public.posts\nINSERT INTO public.posts (id, title, slug, author_id, cover_url, content, status, created_at, updated_at) VALUES\n${values.join(',\n')};`;
}

export function writePostTags(model: BuiltModel): string {
  const values = model.postTags.map(
    pt => `  (${quote(pt.post_id)}, ${quote(pt.tag_id)})`
  );
  return `-- Seed: public.post_tags\nINSERT INTO public.post_tags (post_id, tag_id) VALUES\n${values.join(',\n')};`;
}

export function writeReactions(model: BuiltModel): string {
  const values = model.reactions.map(
    r =>
      `  (${quote(r.id)}, ${quote(r.type)}, ${quote(r.user_id)}, ${r.post_id ? quote(r.post_id) : 'NULL'}, ${r.comment_id ? quote(r.comment_id) : 'NULL'}, ${quoteTs(r.created_at)})`
  );
  return `-- Seed: public.reactions\nINSERT INTO public.reactions (id, type, user_id, post_id, comment_id, created_at) VALUES\n${values.join(',\n')};`;
}

export function writeSavedPosts(model: BuiltModel): string {
  const values = model.savedPosts.map(
    s =>
      `  (${quote(s.user_id)}, ${quote(s.post_id)}, ${quoteTs(s.created_at)})`
  );
  return `-- Seed: public.saved_posts\nINSERT INTO public.saved_posts (user_id, post_id, created_at) VALUES\n${values.join(',\n')};`;
}

export function writeTags(model: BuiltModel): string {
  const values = model.tags.map(
    t => `  (${quote(t.id)}, ${quote(t.value)}, ${quote(t.slug)})`
  );
  return `-- Seed: public.tags\nINSERT INTO public.tags (id, value, slug) VALUES\n${values.join(',\n')};`;
}

export function writeUserTags(model: BuiltModel): string {
  const values = model.userTags.map(
    ut => `  (${quote(ut.user_id)}, ${quote(ut.tag_id)})`
  );
  return `-- Seed: public.user_tags\nINSERT INTO public.user_tags (user_id, tag_id) VALUES\n${values.join(',\n')};`;
}

export function writeViews(model: BuiltModel): string {
  const values = model.views.map(
    v =>
      `  (${quote(v.id)}, ${quote(v.user_id)}, ${quote(v.post_id)}, ${quoteTs(v.created_at)}, ${quoteTs(v.updated_at)})`
  );
  return `-- Seed: public.views\nINSERT INTO public.views (id, user_id, post_id, created_at, updated_at) VALUES\n${values.join(',\n')};`;
}

function escapeJsonForSql(obj: unknown): string {
  const json = JSON.stringify(obj);
  return json.replace(/\\/g, '\\\\').replace(/'/g, "''");
}

function quote(s: string): string {
  return `'${escapeSqlString(s)}'`;
}

function quoteTs(iso: string): string {
  const ts = iso.replace('T', ' ').replace('Z', '+00');
  return `'${escapeSqlString(ts)}'::timestamptz`;
}

const WRITERS: { fn: (m: BuiltModel) => string; name: string }[] = [
  { fn: writeAuthUsers, name: '01_auth_users.sql' },
  { fn: writeAuthIdentities, name: '02_auth_identities.sql' },
  { fn: writeTags, name: '03_tags.sql' },
  { fn: writePosts, name: '04_posts.sql' },
  { fn: writePostTags, name: '05_post_tags.sql' },
  { fn: writeUserTags, name: '06_user_tags.sql' },
  { fn: writeComments, name: '07_comments.sql' },
  { fn: writeFollows, name: '08_follows.sql' },
  { fn: writeReactions, name: '09_reactions.sql' },
  { fn: writeViews, name: '10_views.sql' },
  { fn: writeSavedPosts, name: '11_saved_posts.sql' },
];

export function writeAll(
  model: BuiltModel,
  outputDir: string = OUTPUT_DIR
): void {
  for (const { fn, name } of WRITERS) {
    const path = join(outputDir, name);
    const sql = fn(model);
    writeFileSync(path, sql + '\n', 'utf-8');
  }
}
