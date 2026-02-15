-- Storage bucket for listing images (run after creating bucket in Dashboard or use Storage API)
-- Bucket name: listing-images
-- Public: true if you want public read; we use public URLs for card images

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-images',
  'listing-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- RLS: anyone can read (public bucket)
create policy "Listing images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'listing-images');

-- Only authenticated users can upload (we'll restrict to own listing paths in app)
create policy "Authenticated users can upload listing images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'listing-images');

-- Users can update/delete only their own files (path: listing-images/{user_id}/...)
create policy "Users can update own listing images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'listing-images' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'listing-images');

create policy "Users can delete own listing images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'listing-images' and (storage.foldername(name))[1] = auth.uid()::text);
