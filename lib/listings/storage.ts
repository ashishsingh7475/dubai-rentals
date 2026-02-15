const BUCKET = "listing-images";

export function getListingImagePath(userId: string, listingId: string, filename: string): string {
  const safe = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `${userId}/${listingId}/${Date.now()}-${safe}`;
}

export function getPublicUrl(path: string): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return path;
  return `${url}/storage/v1/object/public/${BUCKET}/${path}`;
}

export function getPublicUrlFromFullPath(fullPath: string): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return fullPath;
  if (fullPath.startsWith("http")) return fullPath;
  const path = fullPath.startsWith(BUCKET + "/") ? fullPath : `${BUCKET}/${fullPath}`;
  return `${url}/storage/v1/object/public/${path}`;
}
