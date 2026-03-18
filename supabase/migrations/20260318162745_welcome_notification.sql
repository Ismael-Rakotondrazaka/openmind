-- Migration: welcome notification
-- Purpose: Enqueue a user_welcomed notification when a user verifies their email.
-- Affected: auth.users (AFTER UPDATE trigger)
-- Notes:
--   - Fires only when confirmed_at transitions from NULL → non-NULL (email verification).
--   - actor_id is NULL because this is a system notification with no human actor.
--   - The self-notification guard in enqueue_notification() is safe: NULL ≠ UUID.

create or replace function public.handle_user_verified()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.confirmed_at is null and new.confirmed_at is not null then
    perform public.enqueue_notification(
      p_recipient_id := new.id,
      p_actor_id     := null,
      p_type         := 'user_welcomed',
      p_data         := '{}'::jsonb
    );
  end if;

  return new;
end;
$$;

comment on function public.handle_user_verified() is 'Enqueues a user_welcomed notification the first time a user verifies their email (confirmed_at NULL → non-NULL).';

create trigger on_auth_user_verified
  after update of confirmed_at on auth.users
  for each row
  execute function public.handle_user_verified();
