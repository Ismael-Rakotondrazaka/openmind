-- Migration: create profile images storage bucket
-- Purpose: Bucket for user profile/avatar images; public read, authenticated write.
-- Affected: storage.buckets, storage.objects (RLS policies)
-- Notes: Objects should be stored under path {user_id}/... so users only manage their own files.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
) values (
  'profile-images',
  'profile-images',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Allow public read for profile images (bucket is public).
create policy "Profile images are publicly readable"
  on storage.objects for select
  to anon, authenticated
  using ( bucket_id = 'profile-images' );

-- Allow authenticated users to upload only into their own folder ({user_id}/...).
create policy "Users can upload their own profile images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'profile-images'
    and (storage.foldername(name))[1] = (auth.uid())::text
  );

-- Allow users to update their own objects (owner_id is set by Storage on insert).
create policy "Users can update their own profile images"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'profile-images' and owner_id = (auth.uid())::text )
  with check ( bucket_id = 'profile-images' and owner_id = (auth.uid())::text );

-- Allow users to delete their own objects.
create policy "Users can delete their own profile images"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'profile-images' and owner_id = (auth.uid())::text );
