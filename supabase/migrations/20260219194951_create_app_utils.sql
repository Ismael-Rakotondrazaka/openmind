-- Migration: Create app utilities
-- Purpose: Create utility functions used across the application
-- Affected functions: handle_updated_at
-- Special considerations: This function is used by triggers to automatically update updated_at timestamps

-- Create function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

comment on function public.handle_updated_at() is 'Trigger function to automatically update the updated_at timestamp column when a row is updated.';
