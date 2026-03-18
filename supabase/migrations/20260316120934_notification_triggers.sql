-- Migration: notification triggers
-- Purpose: Enqueue a notification event whenever a reaction, comment, or follow is inserted.
-- Affected: public.reactions, public.comments, public.follows (AFTER INSERT triggers)
-- Notes:
--   - Soft-deleted posts/comments are silently skipped (deleted_at IS NULL guard).
--   - Self-notifications are already filtered inside enqueue_notification().
--   - Reactions use a 5-minute process_after window to allow burst collapsing.
--   - Comments and follows are enqueued for immediate processing (process_after = now()).

-- ─── handle_reaction_inserted ─────────────────────────────────────────────────
--
-- Fires on every new reaction. Determines whether it targets a post or a comment
-- and enqueues the appropriate event with a delayed process_after to enable
-- aggregation ("Alice, Bob and 12 others reacted to your post").

create or replace function public.handle_reaction_inserted()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_recipient_id uuid;
  v_post_id      uuid;
  v_post_slug    text;
  v_comment_id   uuid;
begin
  if new.post_id is not null then
    -- Reaction on a post: notify the post author
    select p.author_id, p.id, p.slug
    into   v_recipient_id, v_post_id, v_post_slug
    from   public.posts p
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
        'post_id',       v_post_id,
        'post_slug',     v_post_slug,
        'reaction_type', new.type
      ),
      p_process_after := now() + interval '5 minutes'
    );

  elsif new.comment_id is not null then
    -- Reaction on a comment: notify the comment author
    select c.author_id, c.id, p.id, p.slug
    into   v_recipient_id, v_comment_id, v_post_id, v_post_slug
    from   public.comments c
    join   public.posts p on p.id = c.post_id
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
        'comment_id',    v_comment_id,
        'post_id',       v_post_id,
        'post_slug',     v_post_slug,
        'reaction_type', new.type
      ),
      p_process_after := now() + interval '5 minutes'
    );

  end if;

  return new;
end;
$$;

comment on function public.handle_reaction_inserted() is 'Enqueues post_reacted or comment_reacted with a 5-minute delay to allow reaction burst aggregation. Skips reactions on soft-deleted targets.';

create trigger on_reaction_inserted
  after insert on public.reactions
  for each row
  execute function public.handle_reaction_inserted();

-- ─── handle_comment_inserted ──────────────────────────────────────────────────
--
-- Fires on every new comment.
--   - Top-level comment (parent_id IS NULL): notifies the post author (post_commented).
--   - Reply (parent_id IS NOT NULL): notifies the parent comment author (comment_replied).
--     Also notifies the post author only if they are not the parent comment author,
--     so the post author always knows about all activity on their post.

create or replace function public.handle_comment_inserted()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_post_author_id   uuid;
  v_post_slug        text;
  v_parent_author_id uuid;
begin
  -- Fetch post context; bail if post is soft-deleted
  select p.author_id, p.slug
  into   v_post_author_id, v_post_slug
  from   public.posts p
  where  p.id = new.post_id
    and  p.deleted_at is null;

  if v_post_author_id is null then
    return new;
  end if;

  if new.parent_id is null then
    -- Top-level comment: notify post author
    perform public.enqueue_notification(
      p_recipient_id := v_post_author_id,
      p_actor_id     := new.author_id,
      p_type         := 'post_commented',
      p_data         := jsonb_build_object(
        'post_id',    new.post_id,
        'post_slug',  v_post_slug,
        'comment_id', new.id
      )
    );

  else
    -- Reply: notify parent comment author
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
          'post_id',           new.post_id,
          'post_slug',         v_post_slug,
          'comment_id',        new.id,
          'parent_comment_id', new.parent_id
        )
      );
    end if;

    -- Also notify post author if they are not the parent comment author
    -- (so they always stay informed about all activity on their post)
    if v_post_author_id is distinct from v_parent_author_id then
      perform public.enqueue_notification(
        p_recipient_id := v_post_author_id,
        p_actor_id     := new.author_id,
        p_type         := 'post_commented',
        p_data         := jsonb_build_object(
          'post_id',    new.post_id,
          'post_slug',  v_post_slug,
          'comment_id', new.id
        )
      );
    end if;

  end if;

  return new;
end;
$$;

comment on function public.handle_comment_inserted() is 'Enqueues post_commented (top-level comments and replies to the post author) and comment_replied (replies to the direct parent author). Skips comments on soft-deleted posts.';

create trigger on_comment_inserted
  after insert on public.comments
  for each row
  execute function public.handle_comment_inserted();

-- ─── handle_follow_inserted ───────────────────────────────────────────────────
--
-- Fires when a user follows another. Notifies the followed user (following_id).

create or replace function public.handle_follow_inserted()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.enqueue_notification(
    p_recipient_id := new.following_id,
    p_actor_id     := new.follower_id,
    p_type         := 'user_followed',
    p_data         := '{}'::jsonb
  );

  return new;
end;
$$;

comment on function public.handle_follow_inserted() is 'Enqueues user_followed when a follow row is inserted. Self-follow guard is inside enqueue_notification().';

create trigger on_follow_inserted
  after insert on public.follows
  for each row
  execute function public.handle_follow_inserted();
