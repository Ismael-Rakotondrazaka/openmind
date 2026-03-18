-- Migration: create notification preferences
-- Purpose: Per-user, per-group, per-channel opt-in/out for notifications.
-- Affected: public.notification_preferences (new table), public.enqueue_notification (updated)
-- Notes:
--   - One row per (user_id, group_name, channel); enabled=true by default.
--   - Groups: 'comments' (post_commented, comment_replied),
--             'follows'  (user_followed),
--             'reactions' (post_reacted, comment_reacted).
--   - System notifications (user_welcomed, group=null) are always enqueued regardless of prefs.
--   - Existing users are backfilled with 3 enabled rows each.
--   - New users get default rows via an AFTER INSERT trigger on public.users.
--   - enqueue_notification() is replaced to filter channels by preference before inserting.

-- ─── notification_preferences ─────────────────────────────────────────────────

create table public.notification_preferences (
  user_id    uuid        not null references public.users (id) on delete cascade,
  group_name text        not null,
  channel    text        not null,
  enabled    boolean     not null default true,
  created_at timestamptz not null default now(),
  primary key (user_id, group_name, channel)
);

comment on table  public.notification_preferences                is 'Per-user notification opt-in/out. One row per (user, group, channel). enabled=true means deliver, false means suppress.';
comment on column public.notification_preferences.group_name     is 'Logical group: ''comments'', ''follows'', or ''reactions''.';
comment on column public.notification_preferences.channel        is 'Delivery channel: ''in_app''. Extend to ''email'', ''sms'' as features ship.';
comment on column public.notification_preferences.enabled        is 'true = deliver this channel for this group; false = suppress.';

create index notification_preferences_user_id_idx
  on public.notification_preferences (user_id);

alter table public.notification_preferences enable row level security;

create policy "Users can select their own notification preferences"
  on public.notification_preferences for select
  to authenticated
  using ( (select auth.uid()) = user_id );

create policy "Users can insert their own notification preferences"
  on public.notification_preferences for insert
  to authenticated
  with check ( (select auth.uid()) = user_id );

create policy "Users can update their own notification preferences"
  on public.notification_preferences for update
  to authenticated
  using  ( (select auth.uid()) = user_id )
  with check ( (select auth.uid()) = user_id );

-- ─── Trigger: default preferences for new users ───────────────────────────────

create or replace function public.handle_new_user_preferences()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.notification_preferences (user_id, group_name, channel, enabled)
  values
    (new.id, 'comments',  'in_app', true),
    (new.id, 'follows',   'in_app', true),
    (new.id, 'reactions', 'in_app', true);
  return new;
end;
$$;

comment on function public.handle_new_user_preferences() is 'Inserts three default (enabled) preference rows for every new user: comments, follows, reactions × in_app.';

create trigger on_user_created_preferences
  after insert on public.users
  for each row
  execute function public.handle_new_user_preferences();

-- ─── Backfill existing users ──────────────────────────────────────────────────

insert into public.notification_preferences (user_id, group_name, channel, enabled)
select u.id, g.group_name, 'in_app', true
from   public.users u
cross  join (values ('comments'), ('follows'), ('reactions')) as g (group_name)
on conflict (user_id, group_name, channel) do nothing;

-- ─── Replace enqueue_notification ─────────────────────────────────────────────
--
-- Adds a preference check between the self-notification guard and the insert.
-- Channels that the recipient has disabled for the relevant group are filtered out.
-- If no channels remain, the function returns early without inserting.
-- coalesce(enabled, true): a missing row defaults to enabled (safe for race conditions
-- or future channels not yet backfilled).

create or replace function public.enqueue_notification(
  p_recipient_id  uuid,
  p_actor_id      uuid,
  p_type          text,
  p_data          jsonb       default '{}'::jsonb,
  p_channels      text[]      default '{in_app}',
  p_process_after timestamptz default now()
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_group           text;
  v_active_channels text[];
begin
  -- Never notify a user about their own actions
  if p_recipient_id = p_actor_id then
    return;
  end if;

  -- Map notification type to preference group.
  -- null means a system notification (e.g. user_welcomed): always enqueue.
  v_group := case p_type
    when 'post_commented'  then 'comments'
    when 'comment_replied' then 'comments'
    when 'user_followed'   then 'follows'
    when 'post_reacted'    then 'reactions'
    when 'comment_reacted' then 'reactions'
    else null
  end;

  if v_group is not null then
    -- Keep only channels where the recipient has this group enabled.
    -- coalesce to true so a missing row defaults to enabled.
    select array_agg(ch)
    into   v_active_channels
    from   unnest(p_channels) as ch
    where  coalesce((
      select enabled
      from   public.notification_preferences np
      where  np.user_id    = p_recipient_id
        and  np.group_name = v_group
        and  np.channel    = ch
    ), true) = true;
  else
    v_active_channels := p_channels;
  end if;

  -- Nothing to deliver
  if v_active_channels is null or array_length(v_active_channels, 1) = 0 then
    return;
  end if;

  insert into public.notification_queue (
    recipient_id,
    actor_id,
    type,
    data,
    channels,
    process_after
  )
  values (
    p_recipient_id,
    p_actor_id,
    p_type,
    p_data,
    v_active_channels,
    p_process_after
  );
end;
$$;

comment on function public.enqueue_notification(uuid, uuid, text, jsonb, text[], timestamptz) is 'Inserts a raw event into notification_queue after filtering channels by user preferences. Skips self-notifications. Skips entirely if all channels are disabled. System notifications (null group) bypass preference check.';
