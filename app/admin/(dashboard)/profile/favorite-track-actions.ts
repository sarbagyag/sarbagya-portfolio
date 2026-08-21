"use server";

import { ApiError, adminFetch } from "@/lib/api/server";

const MAX_CLIP_SECONDS = 60;
const YOUTUBE_URL_PATTERN = /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)/;

// This action's execution ceiling on Vercel is set via `maxDuration` on
// app/admin/(dashboard)/profile/page.tsx (the page that renders the form
// invoking it), not here — a "use server" file is only allowed to export
// async functions, so route-segment config like maxDuration has to live on
// the page/layout instead.

export async function processFavoriteTrack(input: {
  youtubeUrl: string;
  startSec: number;
  endSec: number;
}): Promise<{ audioUrl?: string; coverUrl?: string; error?: string }> {
  if (!YOUTUBE_URL_PATTERN.test(input.youtubeUrl)) {
    return { error: "Must be a youtube.com or youtu.be video link." };
  }
  if (!Number.isFinite(input.startSec) || !Number.isFinite(input.endSec) || input.endSec <= input.startSec) {
    return { error: "End must be after start." };
  }
  if (input.endSec - input.startSec > MAX_CLIP_SECONDS) {
    return { error: `Clip can't be longer than ${MAX_CLIP_SECONDS} seconds.` };
  }

  try {
    return await adminFetch<{ audioUrl: string; coverUrl?: string }>("/api/admin/favorite-track", {
      method: "POST",
      body: JSON.stringify(input),
    });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Failed to process track." };
  }
}
