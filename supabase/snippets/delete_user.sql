-- Delete a user completely from both public and auth schemas.
-- Replace the UUID below with the target user's ID.
do $$
declare
  target_id uuid := '<INSERT_USER_ID_HERE>';
begin
  -- Detach other users' comments that replied to this user's comments
  update public.comments
  set parent_id = null
  where parent_id in (
    select id from public.comments where author_id = target_id
  );

  -- Public schema: delete in dependency order
  delete from public.reactions   where user_id = target_id;
  delete from public.views       where user_id = target_id;
  delete from public.saved_posts where user_id = target_id;
  delete from public.follows     where follower_id = target_id or following_id = target_id;
  delete from public.user_tags   where user_id = target_id;
  delete from public.comments    where author_id = target_id;

  -- Delete posts and their tags
  delete from public.post_tags where post_id in (select id from public.posts where author_id = target_id);
  delete from public.posts     where author_id = target_id;

  -- Public users row (FK parent of auth.users in public schema)
  delete from public.users where id = target_id;

  -- Auth schema: delete in dependency order before removing auth.users
  delete from auth.mfa_amr_claims where session_id in (select id from auth.sessions where user_id = target_id);
  delete from auth.refresh_tokens  where session_id in (select id from auth.sessions where user_id = target_id);
  delete from auth.sessions        where user_id = target_id;
  delete from auth.mfa_challenges  where factor_id in (select id from auth.mfa_factors where user_id = target_id);
  delete from auth.mfa_factors     where user_id = target_id;
  delete from auth.identities           where user_id = target_id;
  delete from auth.one_time_tokens      where user_id = target_id;
  delete from auth.oauth_authorizations where user_id = target_id;
  delete from auth.oauth_consents       where user_id = target_id;

  -- Finally remove the auth user
  delete from auth.users where id = target_id;

  raise notice 'User % deleted successfully.', target_id;
end;
$$;
