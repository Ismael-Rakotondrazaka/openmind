-- Migration: create post files storage bucket
-- Purpose: Bucket for post attachments (any file type); public read, authenticated write.
-- Affected: storage.buckets, storage.objects (RLS policies)
-- Notes: 50MB limit; objects under path {user_id}/... so users only manage their own files.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit
) values (
  'post-files',
  'post-files',
  true,
  52428800
);

-- Allow public read for post files (bucket is public).
create policy "Post files are publicly readable"
  on storage.objects for select
  to anon, authenticated
  using ( bucket_id = 'post-files' );

-- Allow authenticated users to upload only into their own folder ({user_id}/...).
create policy "Users can upload their own post files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'post-files'
    and (storage.foldername(name))[1] = (auth.uid())::text
  );

-- Allow users to update their own objects (owner_id is set by Storage on insert).
create policy "Users can update their own post files"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'post-files' and owner_id = (auth.uid())::text )
  with check ( bucket_id = 'post-files' and owner_id = (auth.uid())::text );

-- Allow users to delete their own objects.
create policy "Users can delete their own post files"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'post-files' and owner_id = (auth.uid())::text );
