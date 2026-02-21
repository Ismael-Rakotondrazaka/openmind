-- Migration: create reactions table
-- Purpose: User reactions (like, love, celebrate) on posts or comments.
-- Affected: public.reactions
-- Notes: type constrained to like, love, celebrate; default like; one reaction per user per post or per comment.

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
