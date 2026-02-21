-- Migration: create posts table
-- Purpose: Posts written by users.
-- Affected: public.posts

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  author_id uuid not null references public.users (id),
  cover_url text,
  content jsonb not null,
  status text not null default 'published' check (status in ('published', 'draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

comment on table public.posts is 'User-authored posts with slug, content and visibility.';

create unique index posts_slug_key on public.posts (slug);
create index posts_author_id_idx on public.posts (author_id);
create index posts_created_at_idx on public.posts (created_at desc);
create index posts_status_idx on public.posts (status) where status = 'published';
create index posts_deleted_at_idx on public.posts (deleted_at) where deleted_at is null;

alter table public.posts enable row level security;

create policy "Anyone can view published posts; authenticated can also view own"
  on public.posts for select
  to authenticated, anon
  using ( status = 'published' or (select auth.uid()) = author_id );

create policy "Users can insert their own posts"
  on public.posts for insert
  to authenticated
  with check ( (select auth.uid()) = author_id );

create policy "Users can update their own posts"
  on public.posts for update
  to authenticated
  using ( (select auth.uid()) = author_id )
  with check ( (select auth.uid()) = author_id );

create policy "Users can delete their own posts"
  on public.posts for delete
  to authenticated
  using ( (select auth.uid()) = author_id );

create trigger update_posts_updated_at
  before update on public.posts
  for each row
  execute function public.handle_updated_at();
