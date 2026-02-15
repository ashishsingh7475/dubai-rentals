# Storage bucket setup for listing images

The listings system uses a Supabase Storage bucket named **`listing-images`** for property photos. Follow these steps to create and secure it.

## 1. Create the bucket (Supabase Dashboard)

1. Open your [Supabase Dashboard](https://supabase.com/dashboard) and select your project.
2. Go to **Storage** in the sidebar.
3. Click **New bucket**.
4. Set:
   - **Name:** `listing-images`
   - **Public bucket:** ON (so listing images can be shown without signed URLs)
   - **File size limit:** 5 MB (or your preferred max)
   - **Allowed MIME types:** `image/jpeg`, `image/png`, `image/webp`, `image/gif`
5. Click **Create bucket**.

## 2. Apply RLS policies (SQL)

If you prefer to manage the bucket and policies via SQL (e.g. with the Supabase CLI), run the migration that defines the bucket and RLS:

```bash
# From project root, if using Supabase CLI
supabase db push
```

Or run the SQL in **SQL Editor** in the Dashboard:

- **Table and RLS for listings:** `supabase/migrations/20250214000000_create_listings.sql`
- **Storage bucket and RLS for images:** `supabase/migrations/20250214000001_storage_listing_images.sql`

The storage policies do the following:

- **Select:** Anyone can read objects in `listing-images` (public bucket).
- **Insert:** Only authenticated users can upload.
- **Update / Delete:** Users can only update or delete objects under a path that starts with their own `user_id` (e.g. `{user_id}/{listing_id}/...`).

## 3. App configuration

The app assumes:

- Bucket name: `listing-images`
- Files are stored with paths like: `{user_id}/{listing_id}/{timestamp}-{filename}`

No extra env vars are required; the app uses `NEXT_PUBLIC_SUPABASE_URL` and the anon key already configured for auth.

## 4. Troubleshooting

- **Upload fails with “new row violates row-level security”**  
  Ensure the storage RLS policies above are applied and that the upload path starts with the authenticated user’s ID.

- **Images don’t load (403 / broken image)**  
  Confirm the bucket is **public** and the “Listing images are publicly readable” policy exists and targets `bucket_id = 'listing-images'`.

- **“Bucket not found”**  
  Create the bucket in the Dashboard (step 1) or via the migration that inserts into `storage.buckets`.
