-- Migration: create reactions table
-- Purpose: User reactions (like, love, celebrate) on posts or comments.
-- Affected: public.reactions
-- Notes: type constrained to like, love, celebrate; default like; one reaction per user per post or per comment. Trigger keeps reactions_count/reactions_details in sync on posts and comments.

create table public.reactions (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'like' check (type in ('like', 'love', 'celebrate')),
  created_at timestamptz not null default now(),
  user_id uuid not null references public.users (id) on delete cascade,
  post_id uuid references public.posts (id) on delete cascade,
  comment_id uuid references public.comments (id) on delete cascade,
  constraint reactions_target_check check (
    (post_id is not null and comment_id is null) or
    (post_id is null and comment_id is not null)
  )
);

comment on table public.reactions is 'User reactions on posts or comments; type is like, love, celebrate.';

create unique index reactions_user_post_key on public.reactions (user_id, post_id) where post_id is not null;
create unique index reactions_user_comment_key on public.reactions (user_id, comment_id) where comment_id is not null;
create index reactions_post_id_idx on public.reactions (post_id) where post_id is not null;
create index reactions_comment_id_idx on public.reactions (comment_id) where comment_id is not null;
create index reactions_type_idx on public.reactions (type);

alter table public.reactions enable row level security;

create policy "Anyone can view reactions"
  on public.reactions for select
  to authenticated, anon
  using (true);

create policy "Users can add their own reactions"
  on public.reactions for insert
  to authenticated
  with check ( (select auth.uid()) = user_id );

create policy "Users can update their own reactions"
  on public.reactions for update
  to authenticated
  using ( (select auth.uid()) = user_id )
  with check ( (select auth.uid()) = user_id );

create policy "Users can delete their own reactions"
  on public.reactions for delete
  to authenticated
  using ( (select auth.uid()) = user_id );

create or replace function public.sync_reactions_count_for_target(p_post_id uuid, p_comment_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
  v_details jsonb;
begin
  if p_post_id is not null then
    v_count := 0;
    v_details := '{}'::jsonb;
    select
      coalesce(sum(agg.cnt), 0)::integer,
      coalesce(jsonb_object_agg(agg.type, agg.cnt), '{}'::jsonb)
    into v_count, v_details
    from (
      select public.reactions.type, count(*)::integer as cnt
      from public.reactions
      where public.reactions.post_id = p_post_id
      group by public.reactions.type
    ) as agg;

    update public.posts
    set
      reactions_count = v_count,
      reactions_details = v_details
    where public.posts.id = p_post_id;
  elsif p_comment_id is not null then
    v_count := 0;
    v_details := '{}'::jsonb;
    select
      coalesce(sum(agg.cnt), 0)::integer,
      coalesce(jsonb_object_agg(agg.type, agg.cnt), '{}'::jsonb)
    into v_count, v_details
    from (
      select public.reactions.type, count(*)::integer as cnt
      from public.reactions
      where public.reactions.comment_id = p_comment_id
      group by public.reactions.type
    ) as agg;

    update public.comments
    set
      reactions_count = v_count,
      reactions_details = v_details
    where public.comments.id = p_comment_id;
  end if;
end;
$$;

comment on function public.sync_reactions_count_for_target(uuid, uuid) is 'Recomputes reactions_count and reactions_details for one post or comment from public.reactions; used by trigger.';

create or replace function public.reactions_sync_counts_trigger()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_post_id uuid;
  v_comment_id uuid;
begin
  v_post_id := coalesce(new.post_id, old.post_id);
  v_comment_id := coalesce(new.comment_id, old.comment_id);
  perform public.sync_reactions_count_for_target(v_post_id, v_comment_id);
  return coalesce(new, old);
end;
$$;

comment on function public.reactions_sync_counts_trigger() is 'After insert/update/delete on reactions, syncs reactions_count and reactions_details on the target post or comment.';

create trigger reactions_sync_counts
  after insert or update or delete on public.reactions
  for each row
  execute function public.reactions_sync_counts_trigger();
