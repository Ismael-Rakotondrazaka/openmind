-- Migration: restrict tags delete policy
-- Purpose: Remove unrestricted delete access on tags for authenticated users.
--          Tags are shared labels and should not be deletable by regular users.
-- Affected: public.tags

-- Drop the policy that allows any authenticated user to delete any tag (using clause was always true)
drop policy "Authenticated users can delete tags" on public.tags;
