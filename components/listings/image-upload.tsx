"use client";

import { useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getListingImagePath, getPublicUrl } from "@/lib/listings/storage";
import { Button } from "@/components/ui/button";

const BUCKET = "listing-images";
const MAX_FILES = 10;
const MAX_SIZE_MB = 5;
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

export interface ImageUploadProps {
  listingId: string | null;
  userId: string;
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
}

export function ImageUpload({
  listingId,
  userId,
  value,
  onChange,
  disabled,
}: ImageUploadProps) {
  const [drag, setDrag] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).slice(0, MAX_FILES - value.length);
      if (list.length === 0) return;
      setError(null);
      setUploading(true);
      const supabase = createClient();
      const id = listingId ?? "draft";
      const newUrls: string[] = [];
      try {
        for (const file of list) {
          if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            setError(`File ${file.name} is larger than ${MAX_SIZE_MB}MB.`);
            break;
          }
          const path = getListingImagePath(userId, id, file.name);
          const { error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(path, file, { upsert: true });
          if (uploadError) {
            setError(uploadError.message);
            break;
          }
          const url = getPublicUrl(path);
          newUrls.push(url);
        }
        if (newUrls.length) onChange([...value, ...newUrls]);
      } finally {
        setUploading(false);
      }
    },
    [listingId, userId, value, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDrag(false);
      if (disabled || uploading) return;
      uploadFiles(e.dataTransfer.files);
    },
    [disabled, uploading, uploadFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDrag(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length) return;
      uploadFiles(files);
      e.target.value = "";
    },
    [uploadFiles]
  );

  const remove = useCallback(
    (index: number) => {
      if (disabled) return;
      const next = value.filter((_, i) => i !== index);
      onChange(next);
    },
    [value, onChange, disabled]
  );

  const canAdd = value.length < MAX_FILES;

  return (
    <div className="w-full">
      <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Photos
      </p>
      <div className="space-y-3">
        {value.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {value.map((url, i) => (
              <div
                key={url}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800"
              >
                <img
                  src={url}
                  alt=""
                  className="h-full w-full object-cover"
                />
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
                    aria-label="Remove photo"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {canAdd && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={[
              "relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors",
              drag
                ? "border-foreground bg-foreground/5"
                : "border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500",
              disabled && "pointer-events-none opacity-60",
            ].join(" ")}
          >
            <input
              type="file"
              accept={ACCEPT}
              multiple
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={handleInputChange}
              disabled={disabled || uploading}
            />
            {uploading ? (
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
            ) : (
              <>
                <svg
                  className="mb-2 h-10 w-10 text-zinc-400 dark:text-zinc-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h7"
                  />
                </svg>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Drag and drop or click to upload
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                  Up to {MAX_FILES} images, max {MAX_SIZE_MB}MB each
                </p>
              </>
            )}
          </div>
        )}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
}
