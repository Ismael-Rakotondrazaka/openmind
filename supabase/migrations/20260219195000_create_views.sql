-- Migration: create views table
-- Purpose: Track post view events per user.
-- Affected: public.views

create table public.views (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null references public.users (id) on delete cascade,
  post_id uuid not null references public.posts (id) on delete cascade
);

comment on table public.views is 'Records of post views by users.';

create index views_post_id_idx on public.views (post_id);
create index views_user_id_idx on public.views (user_id);
create index views_created_at_idx on public.views (created_at desc);

alter table public.views enable row level security;

create policy "Users can view their own view records"
  on public.views for select
  to authenticated
  using ( (select auth.uid()) = user_id );

create policy "Users can create view records for themselves"
  on public.views for insert
  to authenticated
  with check ( (select auth.uid()) = user_id );

create policy "Users can update their own view records"
  on public.views for update
  to authenticated
  using ( (select auth.uid()) = user_id )
  with check ( (select auth.uid()) = user_id );

create trigger update_views_updated_at
  before update on public.views
  for each row
  execute function public.handle_updated_at();

create or replace function public.views_sync_posts_views_count_trigger()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op in ('DELETE', 'UPDATE') and old.post_id is not null then
    perform public.sync_posts_views_count(old.post_id);
  end if;
  if tg_op in ('INSERT', 'UPDATE') and new.post_id is not null then
    perform public.sync_posts_views_count(new.post_id);
  end if;
  return coalesce(new, old);
end;
$$;

comment on function public.views_sync_posts_views_count_trigger() is 'After insert/update/delete on views, syncs views_count on the affected post(s).';

create trigger views_sync_posts_views_count
  after insert or update or delete on public.views
  for each row
  execute function public.views_sync_posts_views_count_trigger();
