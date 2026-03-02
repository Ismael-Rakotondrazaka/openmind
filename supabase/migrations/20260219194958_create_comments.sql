-- Migration: create comments table
-- Purpose: Comments on posts with optional parent for threading.
-- Affected: public.comments

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  content jsonb not null,
  parent_id uuid references public.comments (id) on delete cascade,
  depth smallint not null default 0,
  author_id uuid not null references public.users (id),
  post_id uuid not null references public.posts (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  reactions_count integer not null default 0,
  reactions_details jsonb not null default '{}'::jsonb
);

comment on table public.comments is 'Threaded comments on posts; depth is 0 for top-level, 1 for first reply, etc.';
comment on column public.comments.reactions_count is 'Total number of reactions on this comment; maintained by trigger on public.reactions.';
comment on column public.comments.reactions_details is 'Per-type reaction counts, e.g. {"like": 5, "love": 2, "celebrate": 1}; maintained by trigger on public.reactions.';

create index comments_post_id_idx on public.comments (post_id);
create index comments_author_id_idx on public.comments (author_id);
create index comments_parent_id_idx on public.comments (parent_id) where parent_id is not null;
create index comments_depth_idx on public.comments (depth);
create index comments_created_at_idx on public.comments (created_at desc);
create index comments_deleted_at_idx on public.comments (deleted_at) where deleted_at is null;

alter table public.comments enable row level security;

create policy "Anyone can view comments"
  on public.comments for select
  to authenticated, anon
  using (true);

create policy "Users can create comments as themselves"
  on public.comments for insert
  to authenticated
  with check ( (select auth.uid()) = author_id );

create policy "Users can update their own comments"
  on public.comments for update
  to authenticated
  using ( (select auth.uid()) = author_id )
  with check ( (select auth.uid()) = author_id );

create policy "Users can delete their own comments"
  on public.comments for delete
  to authenticated
  using ( (select auth.uid()) = author_id );

create trigger update_comments_updated_at
  before update on public.comments
  for each row
  execute function public.handle_updated_at();

-- Realtime: broadcast comment changes to post-scoped topic for private channel subscription
create or replace function public.comments_broadcast_changes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform realtime.broadcast_changes(
    'post:' || coalesce(new.post_id, old.post_id)::text || ':comments',
    tg_op,
    tg_op,
    tg_table_name,
    tg_table_schema,
    new,
    old
  );
  return coalesce(new, old);
end;
$$;

comment on function public.comments_broadcast_changes() is 'Broadcasts comment insert/update/delete to topic post:<post_id>:comments for Realtime subscription.';

create trigger comments_broadcast_changes
  after insert or update or delete on public.comments
  for each row
  execute function public.comments_broadcast_changes();

create or replace function public.comments_sync_posts_comments_count_trigger()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op in ('DELETE', 'UPDATE') and old.post_id is not null then
    perform public.sync_posts_comments_count(old.post_id);
  end if;
  if tg_op in ('INSERT', 'UPDATE') and new.post_id is not null then
    perform public.sync_posts_comments_count(new.post_id);
  end if;
  return coalesce(new, old);
end;
$$;

comment on function public.comments_sync_posts_comments_count_trigger() is 'After insert/update/delete on comments, syncs comments_count on the affected post(s).';

create trigger comments_sync_posts_comments_count
  after insert or update or delete on public.comments
  for each row
  execute function public.comments_sync_posts_comments_count_trigger();

-- RLS: allow clients to subscribe to comment broadcast channel (topic = post:<id>:comments)
create policy "Anyone can receive comment broadcasts for posts"
  on realtime.messages for select
  to authenticated, anon
  using ( topic like 'post:%:comments' );
