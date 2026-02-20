-- Migration: enable_extensions
-- Purpose: Enable required PostgreSQL extensions
-- Note: In Supabase, extensions are typically in the 'extensions' schema

-- Enable pg_net extension for HTTP calls from PostgreSQL
-- Required for extract_rrule_dates trigger to call Edge Functions
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Enable pg_cron extension for scheduled database tasks
-- Required for auto-expiring pending missions
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

COMMENT ON EXTENSION pg_net IS 'PostgreSQL extension for making HTTP requests from the database';
COMMENT ON EXTENSION pg_cron IS 'PostgreSQL extension for scheduling database functions to run periodically (e.g., hourly, daily)';
