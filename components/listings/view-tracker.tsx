"use client";

import { useEffect } from "react";
import { trackListingView } from "@/app/actions/trust";

export function ViewTracker({ listingId }: { listingId: string }) {
  useEffect(() => {
    const key = `viewed:${listingId}`;
    if (sessionStorage.getItem(key)) return;
    const sessionKey = "trust-session-id";
    let sessionId = localStorage.getItem(sessionKey);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem(sessionKey, sessionId);
    }
    sessionStorage.setItem(key, "1");
    void trackListingView({ listingId, sessionId });
  }, [listingId]);

  return null;
}
