-- Migration: add_post_author_username_to_notifications
-- Purpose: Include post_author_username in notification data payloads so the frontend
--          can build post links (/u/:username/p/:postId/:postSlug) without extra queries.
-- Affected: public.handle_reaction_inserted, public.handle_comment_inserted (recreated)

-- ─── handle_reaction_inserted ─────────────────────────────────────────────────

create or replace function public.handle_reaction_inserted()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_recipient_id         uuid;
  v_post_id              uuid;
  v_post_slug            text;
  v_post_author_username text;
  v_comment_id           uuid;
begin
  if new.post_id is not null then
    select p.author_id, p.id, p.slug, u.username
    into   v_recipient_id, v_post_id, v_post_slug, v_post_author_username
    from   public.posts p
    join   public.users u on u.id = p.author_id
    where  p.id = new.post_id
      and  p.deleted_at is null;

    if v_recipient_id is null then
      return new;
    end if;

    perform public.enqueue_notification(
      p_recipient_id  := v_recipient_id,
      p_actor_id      := new.user_id,
      p_type          := 'post_reacted',
      p_data          := jsonb_build_object(
        'post_id',              v_post_id,
        'post_slug',            v_post_slug,
        'post_author_username', v_post_author_username,
        'reaction_type',        new.type
      ),
      p_process_after := now() + interval '5 minutes'
    );

  elsif new.comment_id is not null then
    select c.author_id, c.id, p.id, p.slug, u.username
    into   v_recipient_id, v_comment_id, v_post_id, v_post_slug, v_post_author_username
    from   public.comments c
    join   public.posts p on p.id = c.post_id
    join   public.users u on u.id = p.author_id
    where  c.id = new.comment_id
      and  c.deleted_at is null
      and  p.deleted_at is null;

    if v_recipient_id is null then
      return new;
    end if;

    perform public.enqueue_notification(
      p_recipient_id  := v_recipient_id,
      p_actor_id      := new.user_id,
      p_type          := 'comment_reacted',
      p_data          := jsonb_build_object(
        'comment_id',           v_comment_id,
        'post_id',              v_post_id,
        'post_slug',            v_post_slug,
        'post_author_username', v_post_author_username,
        'reaction_type',        new.type
      ),
      p_process_after := now() + interval '5 minutes'
    );

  end if;

  return new;
end;
$$;

comment on function public.handle_reaction_inserted() is 'Enqueues post_reacted or comment_reacted with a 5-minute delay to allow reaction burst aggregation. Data now includes post_author_username for building post links.';

-- ─── handle_comment_inserted ──────────────────────────────────────────────────

create or replace function public.handle_comment_inserted()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_post_author_id       uuid;
  v_post_slug            text;
  v_post_author_username text;
  v_parent_author_id     uuid;
begin
  select p.author_id, p.slug, u.username
  into   v_post_author_id, v_post_slug, v_post_author_username
  from   public.posts p
  join   public.users u on u.id = p.author_id
  where  p.id = new.post_id
    and  p.deleted_at is null;

  if v_post_author_id is null then
    return new;
  end if;

  if new.parent_id is null then
    perform public.enqueue_notification(
      p_recipient_id := v_post_author_id,
      p_actor_id     := new.author_id,
      p_type         := 'post_commented',
      p_data         := jsonb_build_object(
        'post_id',              new.post_id,
        'post_slug',            v_post_slug,
        'post_author_username', v_post_author_username,
        'comment_id',           new.id
      )
    );

  else
    select c.author_id
    into   v_parent_author_id
    from   public.comments c
    where  c.id = new.parent_id
      and  c.deleted_at is null;

    if v_parent_author_id is not null then
      perform public.enqueue_notification(
        p_recipient_id := v_parent_author_id,
        p_actor_id     := new.author_id,
        p_type         := 'comment_replied',
        p_data         := jsonb_build_object(
          'post_id',              new.post_id,
          'post_slug',            v_post_slug,
          'post_author_username', v_post_author_username,
          'comment_id',           new.id,
          'parent_comment_id',    new.parent_id
        )
      );
    end if;

    if v_post_author_id is distinct from v_parent_author_id then
      perform public.enqueue_notification(
        p_recipient_id := v_post_author_id,
        p_actor_id     := new.author_id,
        p_type         := 'post_commented',
        p_data         := jsonb_build_object(
          'post_id',              new.post_id,
          'post_slug',            v_post_slug,
          'post_author_username', v_post_author_username,
          'comment_id',           new.id
        )
      );
    end if;

  end if;

  return new;
end;
$$;

comment on function public.handle_comment_inserted() is 'Enqueues post_commented and comment_replied. Data now includes post_author_username for building post links.';
