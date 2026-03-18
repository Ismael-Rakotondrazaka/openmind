-- Migration: unread_notifications_count
-- Purpose: Add a denormalized unread notification counter to public.users, maintained by trigger.
-- Affected: public.users (new column), public.notifications (new trigger)
-- Notes:
--   - Counter is incremented on INSERT when read_at IS NULL.
--   - Counter is decremented on DELETE when the deleted row was unread (read_at IS NULL).
--   - Counter is adjusted on UPDATE when read_at flips between NULL and non-NULL
--     (covers both mark-as-read and aggregation resets that clear read_at).
--   - Floor at 0 to guard against any out-of-order edge cases.

alter table public.users
  add column unread_notifications_count integer not null default 0;

comment on column public.users.unread_notifications_count is 'Number of unread notifications for this user; maintained by trigger on public.notifications.';

-- ─── handle_notification_unread_count ─────────────────────────────────────────
--
-- Keeps users.unread_notifications_count in sync with notifications.read_at.
--
-- INSERT  → increment when new row is unread
-- DELETE  → decrement when deleted row was unread
-- UPDATE  → adjust when read_at flips:
--             NULL → non-NULL  (marked read)   → decrement
--             non-NULL → NULL  (reset unread)  → increment

create or replace function public.handle_notification_unread_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if new.read_at is null then
      update public.users
        set unread_notifications_count = greatest(0, unread_notifications_count + 1)
        where id = new.recipient_id;
    end if;

  elsif tg_op = 'DELETE' then
    if old.read_at is null then
      update public.users
        set unread_notifications_count = greatest(0, unread_notifications_count - 1)
        where id = old.recipient_id;
    end if;

  elsif tg_op = 'UPDATE' then
    if old.read_at is null and new.read_at is not null then
      -- Marked as read
      update public.users
        set unread_notifications_count = greatest(0, unread_notifications_count - 1)
        where id = new.recipient_id;
    elsif old.read_at is not null and new.read_at is null then
      -- Reset to unread (e.g. new actor aggregated into an already-read notification)
      update public.users
        set unread_notifications_count = greatest(0, unread_notifications_count + 1)
        where id = new.recipient_id;
    end if;
  end if;

  return coalesce(new, old);
end;
$$;

comment on function public.handle_notification_unread_count() is 'Keeps users.unread_notifications_count in sync with notifications.read_at on insert, update, and delete.';

create trigger on_notification_unread_count
  after insert or update of read_at or delete on public.notifications
  for each row
  execute function public.handle_notification_unread_count();

-- Backfill counter for any pre-existing notifications
update public.users u
set unread_notifications_count = (
  select count(*) from public.notifications n
  where n.recipient_id = u.id and n.read_at is null
);
