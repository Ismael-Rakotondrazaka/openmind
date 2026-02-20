-- Migration: create user_tags join table
-- Purpose: Many-to-many between users and tags (user interests).
-- Affected: public.user_tags

create table public.user_tags (
  user_id uuid not null references public.users (id) on delete cascade,
  tag_id bigint not null references public.tags (id) on delete cascade,
  primary key (user_id, tag_id)
);

comment on table public.user_tags is 'Links users to tags for interests (many-to-many).';

create index user_tags_tag_id_idx on public.user_tags (tag_id);

alter table public.user_tags enable row level security;

create policy "Anyone can view user tags"
  on public.user_tags for select
  to authenticated, anon
  using (true);

create policy "Users can add tags to their own profile"
  on public.user_tags for insert
  to authenticated
  with check ( (select auth.uid()) = user_id );

create policy "Users can update their own tags"
  on public.user_tags for update
  to authenticated
  using ( (select auth.uid()) = user_id )
  with check ( (select auth.uid()) = user_id );

create policy "Users can remove tags from their own profile"
  on public.user_tags for delete
  to authenticated
  using ( (select auth.uid()) = user_id );
