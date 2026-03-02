-- Migration: create post_tags join table
-- Purpose: Many-to-many between posts and tags.
-- Affected: public.post_tags

create table public.post_tags (
  post_id uuid not null references public.posts (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (post_id, tag_id)
);

comment on table public.post_tags is 'Links posts to tags (many-to-many).';

create index post_tags_tag_id_idx on public.post_tags (tag_id);

alter table public.post_tags enable row level security;

create policy "Anyone can view post tags"
  on public.post_tags for select
  to authenticated, anon
  using (true);

create policy "Post authors can add tags to their posts"
  on public.post_tags for insert
  to authenticated
  with check (
    exists (
      select 1 from public.posts
      where id = post_id and author_id = (select auth.uid())
    )
  );

create policy "Post authors can update tags on their posts"
  on public.post_tags for update
  to authenticated
  using (
    exists (
      select 1 from public.posts
      where id = post_id and author_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.posts
      where id = post_id and author_id = (select auth.uid())
    )
  );

create policy "Post authors can remove tags from their posts"
  on public.post_tags for delete
  to authenticated
  using (
    exists (
      select 1 from public.posts
      where id = post_id and author_id = (select auth.uid())
    )
  );
