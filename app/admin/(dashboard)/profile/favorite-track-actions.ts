"use server";

import { ApiError, adminFetch } from "@/lib/api/server";

const MAX_CLIP_SECONDS = 60;
const YOUTUBE_URL_PATTERN = /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)/;

// The Go API does the actual work (yt-dlp download, ffmpeg trim, MinIO
// upload) and can legitimately take a while — this bumps the Server
// Action's own execution ceiling to match its 150s route timeout (see
// server/internal/api/router.go), since platforms like Vercel default
// Server Actions to a much shorter one (10s on Hobby) that would otherwise
// kill this action while the Go side is still working.
export const maxDuration = 150;

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
