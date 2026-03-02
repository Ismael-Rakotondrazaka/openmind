-- Migration: create saved_posts table
-- Purpose: User bookmarks for posts (user_id + post_id unique).
-- Affected: public.saved_posts

create table public.saved_posts (
  user_id uuid not null references public.users (id) on delete cascade,
  post_id uuid not null references public.posts (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

comment on table public.saved_posts is 'User-saved (bookmarked) posts.';

create index saved_posts_post_id_idx on public.saved_posts (post_id);
create index saved_posts_created_at_idx on public.saved_posts (created_at desc);

alter table public.saved_posts enable row level security;

create policy "Users can view their own saved posts"
  on public.saved_posts for select
  to authenticated
  using ( (select auth.uid()) = user_id );

create policy "Users can save posts for themselves"
  on public.saved_posts for insert
  to authenticated
  with check ( (select auth.uid()) = user_id );

create policy "Users can update their own saved posts"
  on public.saved_posts for update
  to authenticated
  using ( (select auth.uid()) = user_id )
  with check ( (select auth.uid()) = user_id );

create policy "Users can remove their own saved posts"
  on public.saved_posts for delete
  to authenticated
  using ( (select auth.uid()) = user_id );
