"use client";

import { useState, useCallback, useEffect } from "react";

type ListingImageGalleryProps = {
  images: string[];
  alt: string;
  /** Slot for overlay (e.g. Save button) */
  overlay?: React.ReactNode;
};

export function ListingImageGallery({
  images,
  alt,
  overlay,
}: ListingImageGalleryProps) {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => {
        const next = i + dir;
        if (next < 0) return images.length - 1;
        if (next >= images.length) return 0;
        return next;
      });
    },
    [images.length]
  );

  useEffect(() => {
    if (!fullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fullscreen, go]);

  if (images.length === 0) {
    return (
      <div className="relative aspect-[16/10] w-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
        <span>No image</span>
        {overlay}
      </div>
    );
  }

  return (
    <>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 rounded-t-2xl">
        {/* Main image */}
        <div
          className="relative h-full w-full cursor-zoom-in overflow-hidden"
          onClick={() => setFullscreen(true)}
        >
          <img
            src={images[index]}
            alt={`${alt} ${index + 1}`}
            loading={index === 0 ? "eager" : "lazy"}
            className="h-full w-full object-cover transition-opacity"
          />
        </div>

        {/* Nav arrows - desktop */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow-md hover:bg-white flex items-center justify-center text-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-opacity"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); go(1); }}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow-md hover:bg-white flex items-center justify-center text-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-opacity"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm">
            {images.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                className={`shrink-0 w-12 h-8 rounded overflow-hidden border-2 transition-opacity ${
                  i === index ? "border-white opacity-100" : "border-transparent opacity-60 hover:opacity-80"
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Overlay slot */}
        {overlay}
      </div>

      {/* Fullscreen viewer */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
        >
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className="absolute right-4 top-4 h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center z-10"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center"
            aria-label="Previous"
          >
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <img
            src={images[index]}
            alt={`${alt} ${index + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={() => go(1)}
          />
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center"
            aria-label="Next"
          >
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
            {index + 1} / {images.length}
          </span>
        </div>
      )}
    </>
  );
}
