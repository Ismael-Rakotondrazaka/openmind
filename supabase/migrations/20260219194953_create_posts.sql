-- Migration: create posts table
-- Purpose: Posts written by users.
-- Affected: public.posts

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  author_id uuid not null references public.users (id),
  summary text,
  cover_url text,
  content text not null,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

comment on table public.posts is 'User-authored posts with slug, content and visibility.';

create unique index posts_slug_key on public.posts (slug);
create index posts_author_id_idx on public.posts (author_id);
create index posts_created_at_idx on public.posts (created_at desc);
create index posts_is_visible_idx on public.posts (is_visible) where is_visible = true;
create index posts_deleted_at_idx on public.posts (deleted_at) where deleted_at is null;

alter table public.posts enable row level security;

create policy "Anyone can view visible posts; authenticated can also view own"
  on public.posts for select
  to authenticated, anon
  using ( is_visible = true or (select auth.uid()) = author_id );

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
