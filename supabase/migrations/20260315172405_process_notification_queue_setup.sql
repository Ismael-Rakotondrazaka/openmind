-- Migration: process notification queue setup
-- Purpose: DB helpers and pg_cron job to drive the process-notification-queue edge function.
-- Affected: public.notifications (aggregate_key), public.notification_queue (status constraint),
--           public.claim_notification_queue_batch, public.upsert_notification,
--           public.mark_notification_queue_processed, public.mark_notification_queue_failed

-- ─── notifications: aggregate_key ────────────────────────────────────────────
--
-- Stable key used to upsert aggregated notifications (e.g. all reactions to a
-- given post collapse into one row).
-- Format: "<type>:<entity_id>"  e.g. "post_reacted:abc123"
-- Non-aggregated types leave this null; each event becomes its own row.

alter table public.notifications
  add column aggregate_key text;

comment on column public.notifications.aggregate_key is 'Stable key for aggregated notification types (e.g. post_reacted:<post_id>). Null for non-aggregated events. Unique per recipient when set.';

-- Partial unique index: one aggregated notification per recipient per target
create unique index notifications_aggregate_key_idx
  on public.notifications (recipient_id, aggregate_key)
  where aggregate_key is not null;

-- ─── notification_queue: add 'processing' status ─────────────────────────────
--
-- 'processing' is set atomically when a batch is claimed, preventing double-processing
-- if the cron fires while a previous run is still in flight.

-- Drop the unnamed check constraint and recreate with 'processing' included
alter table public.notification_queue
  drop constraint notification_queue_status_check;

alter table public.notification_queue
  add constraint notification_queue_status_check
  check (status in ('pending', 'processing', 'processed', 'failed'));

-- ─── claim_notification_queue_batch ──────────────────────────────────────────
--
-- Atomically marks up to p_limit pending-and-due rows as 'processing' and returns
-- them. FOR UPDATE SKIP LOCKED ensures concurrent cron invocations never claim the
-- same rows.

create or replace function public.claim_notification_queue_batch(p_limit int default 500)
returns setof public.notification_queue
language sql
security definer
set search_path = ''
as $$
  update public.notification_queue
  set status = 'processing'
  where id in (
    select id
    from public.notification_queue
    where status = 'pending'
      and process_after <= now()
    order by process_after
    limit p_limit
    for update skip locked
  )
  returning *;
$$;

comment on function public.claim_notification_queue_batch(int) is 'Atomically claims up to p_limit pending-and-due queue rows by setting status=processing and returning them. Safe for concurrent invocations via FOR UPDATE SKIP LOCKED.';

-- ─── upsert_notification ─────────────────────────────────────────────────────
--
-- Inserts a new notification or, for aggregated types (aggregate_key not null),
-- merges into an existing row by updating the actor, incrementing actor_count in
-- data, and resetting read_at (new activity = unread again).

create or replace function public.upsert_notification(
  p_recipient_id    uuid,
  p_actor_id        uuid,
  p_type            text,
  p_data            jsonb,
  p_aggregate_key   text    default null,
  p_actor_count_delta int   default 1
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id            uuid;
  v_existing_count int;
begin
  if p_aggregate_key is not null then
    select id,
           coalesce((data->>'actor_count')::int, 1)
    into   v_id, v_existing_count
    from   public.notifications
    where  recipient_id  = p_recipient_id
      and  aggregate_key = p_aggregate_key;

    if v_id is not null then
      update public.notifications
      set
        actor_id    = p_actor_id,
        -- Merge data: keep existing fields, overlay new ones, update actor_count
        data        = (p_data - 'actor_count') ||
                      jsonb_build_object('actor_count', v_existing_count + p_actor_count_delta),
        read_at     = null,   -- new activity = unread again
        updated_at  = now()
      where id = v_id;

      return v_id;
    end if;
  end if;

  -- Insert: for aggregated seed the actor_count to p_actor_count_delta
  insert into public.notifications (recipient_id, actor_id, type, data, aggregate_key)
  values (
    p_recipient_id,
    p_actor_id,
    p_type,
    case
      when p_aggregate_key is not null
      then (p_data - 'actor_count') || jsonb_build_object('actor_count', p_actor_count_delta)
      else p_data
    end,
    p_aggregate_key
  )
  returning id into v_id;

  return v_id;
end;
$$;

comment on function public.upsert_notification(uuid, uuid, text, jsonb, text, int) is 'Inserts or merges a notification. For aggregated types (aggregate_key not null) it increments data.actor_count and resets read_at on the existing row rather than inserting a duplicate.';

-- ─── mark_notification_queue_processed ───────────────────────────────────────

create or replace function public.mark_notification_queue_processed(p_ids uuid[])
returns void
language sql
security definer
set search_path = ''
as $$
  update public.notification_queue
  set status = 'processed'
  where id = any(p_ids);
$$;

comment on function public.mark_notification_queue_processed(uuid[]) is 'Marks a batch of queue rows as processed after successful delivery.';

-- ─── mark_notification_queue_failed ──────────────────────────────────────────

create or replace function public.mark_notification_queue_failed(p_ids uuid[], p_error text)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.notification_queue
  set
    status        = 'failed',
    error_message = p_error
  where id = any(p_ids);
$$;

comment on function public.mark_notification_queue_failed(uuid[], text) is 'Marks a batch of queue rows as failed and stores the error message for debugging.';

-- ─── pg_cron: process-notification-queue every minute ────────────────────────
--
-- Calls the edge function via pg_net. Credentials are read from Vault so they
-- are never hardcoded in the migration.

select cron.schedule(
  'process-notification-queue',
  '* * * * *',
  $$
    select extensions.net.http_post(
      url     := (
        select decrypted_secret
        from   vault.decrypted_secrets
        where  name = 'supabase_url'
        limit  1
      ) || '/functions/v1/process-notification-queue',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'apikey', (
          select decrypted_secret
          from   vault.decrypted_secrets
          where  name = 'supabase_service_role_key'
          limit  1
        )
      ),
      body    := '{}'::jsonb
    );
  $$
);
