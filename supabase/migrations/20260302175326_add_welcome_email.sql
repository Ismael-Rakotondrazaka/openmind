-- Call send-welcome-email Edge Function when a user verifies email for the first time
CREATE OR REPLACE FUNCTION public.handle_auth_user_email_verified() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '' AS $$
DECLARE api_endpoint TEXT;
supabase_url TEXT;
service_role_key TEXT;
BEGIN
SELECT decrypted_secret INTO supabase_url
FROM vault.decrypted_secrets
WHERE name = 'supabase_url'
LIMIT 1;
SELECT decrypted_secret INTO service_role_key
FROM vault.decrypted_secrets
WHERE name = 'supabase_service_role_key'
LIMIT 1;
IF supabase_url IS NULL
OR service_role_key IS NULL THEN RAISE EXCEPTION 'Missing vault secrets: supabase_url or supabase_service_role_key';
END IF;
api_endpoint := supabase_url || '/functions/v1/send-welcome-email';
PERFORM net.http_post(
    url := api_endpoint,
    body := pg_catalog.jsonb_build_object(
        'email',
        NEW.email,
        'email_confirmed_at',
        NEW.email_confirmed_at,
        'user_id',
        NEW.id
    ),
    headers := pg_catalog.jsonb_build_object(
        'Content-Type',
        'application/json',
        'apikey',
        service_role_key
    )
);
RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS on_auth_user_email_verified ON auth.users;
CREATE TRIGGER on_auth_user_email_verified
AFTER
UPDATE OF email_confirmed_at ON auth.users FOR EACH ROW
    WHEN (
        OLD.email_confirmed_at IS NULL
        AND NEW.email_confirmed_at IS NOT NULL
    ) EXECUTE FUNCTION public.handle_auth_user_email_verified();