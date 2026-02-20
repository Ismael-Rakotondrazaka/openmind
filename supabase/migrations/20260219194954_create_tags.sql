-- Migration: create tags table
-- Purpose: Tag values for categorizing posts and users.
-- Affected: public.tags

create table public.tags (
  id bigint generated always as identity primary key,
  value text not null
);

comment on table public.tags is 'Unique tag labels used for posts and user interests.';

create unique index tags_value_key on public.tags (value);

alter table public.tags enable row level security;

create policy "Anyone can view tags"
  on public.tags for select
  to authenticated, anon
  using (true);

create policy "Authenticated users can create tags"
  on public.tags for insert
  to authenticated
  with check (true);

create policy "Authenticated users can delete tags"
  on public.tags for delete
  to authenticated
  using (true);
