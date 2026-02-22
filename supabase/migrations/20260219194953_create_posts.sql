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
  published_at timestamptz,
  deleted_at timestamptz,
  reactions_count integer not null default 0,
  reactions_details jsonb not null default '{}'::jsonb,
  views_count integer not null default 0,
  comments_count integer not null default 0
);

comment on table public.posts is 'User-authored posts with slug, content and visibility.';
comment on column public.posts.reactions_count is 'Total number of reactions on this post; maintained by trigger on public.reactions.';
comment on column public.posts.reactions_details is 'Per-type reaction counts, e.g. {"like": 5, "love": 2, "celebrate": 1}; maintained by trigger on public.reactions.';
comment on column public.posts.views_count is 'Total number of views; maintained by trigger on public.views.';
comment on column public.posts.comments_count is 'Total number of non-deleted comments; maintained by trigger on public.comments.';
comment on column public.posts.published_at is 'When the post was first published; set by trigger when status becomes published.';

create unique index posts_slug_key on public.posts (slug);
create index posts_author_id_idx on public.posts (author_id);
create index posts_created_at_idx on public.posts (created_at desc);
create index posts_published_at_idx on public.posts (published_at desc nulls last) where status = 'published';
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

create or replace function public.posts_set_published_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.status = 'published' and (old.status is distinct from 'published' or old.status is null)
    and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end;
$$;

comment on function public.posts_set_published_at() is 'Sets published_at when a post is first published.';

create trigger posts_set_published_at
  before insert or update on public.posts
  for each row
  execute function public.posts_set_published_at();

-- Sync views_count on posts from public.views (used by trigger on public.views)
create or replace function public.sync_posts_views_count(p_post_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_count integer;
begin
  if p_post_id is null then
    return;
  end if;
  select count(*)::integer
  into v_count
  from public.views
  where public.views.post_id = p_post_id;

  update public.posts
  set views_count = v_count
  where public.posts.id = p_post_id;
end;
$$;

comment on function public.sync_posts_views_count(uuid) is 'Recomputes views_count for one post from public.views; used by trigger.';

-- Sync comments_count on posts from public.comments (used by trigger on public.comments)
create or replace function public.sync_posts_comments_count(p_post_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_count integer;
begin
  if p_post_id is null then
    return;
  end if;
  select count(*)::integer
  into v_count
  from public.comments
  where public.comments.post_id = p_post_id
    and public.comments.deleted_at is null;

  update public.posts
  set comments_count = v_count
  where public.posts.id = p_post_id;
end;
$$;

comment on function public.sync_posts_comments_count(uuid) is 'Recomputes comments_count for one post from public.comments (non-deleted only); used by trigger.';
