"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { processFavoriteTrack } from "@/app/admin/(dashboard)/profile/favorite-track-actions";

interface FavoriteTrackFieldProps {
  defaultAudioUrl?: string | null;
  defaultCoverUrl?: string | null;
  defaultSourceUrl?: string | null;
}

// Paste a YouTube link + a [start, end] window (capped at 60s) and hit
// "Fetch & trim clip" — the Go API downloads the audio with yt-dlp, trims
// it with ffmpeg, and re-hosts the result in our own MinIO bucket. Same
// "upload once, submit the resulting URL with the rest of the form" shape
// as FileUploadField, just with a processing step instead of a raw file
// picker, and slow enough (real network fetch + transcode) to need its own
// loading state separate from the main Save button.
export default function FavoriteTrackField({
  defaultAudioUrl,
  defaultCoverUrl,
  defaultSourceUrl,
}: FavoriteTrackFieldProps) {
  const [youtubeUrl, setYoutubeUrl] = useState(defaultSourceUrl ?? "");
  const [startSec, setStartSec] = useState("");
  const [endSec, setEndSec] = useState("");
  const [audioUrl, setAudioUrl] = useState(defaultAudioUrl ?? "");
  const [coverUrl, setCoverUrl] = useState(defaultCoverUrl ?? "");
  const [sourceUrl, setSourceUrl] = useState(defaultSourceUrl ?? "");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const canProcess = youtubeUrl.trim() && startSec !== "" && endSec !== "" && !processing;

  const handleProcess = async () => {
    setProcessing(true);
    setError("");

    const result = await processFavoriteTrack({
      youtubeUrl: youtubeUrl.trim(),
      startSec: Number(startSec),
      endSec: Number(endSec),
    });

    if (result.audioUrl) {
      setAudioUrl(result.audioUrl);
      setCoverUrl(result.coverUrl ?? "");
      setSourceUrl(youtubeUrl.trim());
    } else {
      setError(result.error ?? "Processing failed.");
    }
    setProcessing(false);
  };

  const clear = () => {
    setAudioUrl("");
    setCoverUrl("");
    setSourceUrl("");
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-text-primary mb-1.5">Favorite track (from YouTube)</label>

      <div className="flex flex-wrap items-end gap-3">
        <input
          type="url"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="flex-1 min-w-[220px] px-3.5 py-2 bg-bg-primary border border-border-color text-text-primary text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        <div className="w-20">
          <label className="block text-xs text-text-tertiary mb-1">Start (s)</label>
          <input
            type="number"
            min={0}
            value={startSec}
            onChange={(e) => setStartSec(e.target.value)}
            className="w-full px-3 py-2 bg-bg-primary border border-border-color text-text-primary text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="w-20">
          <label className="block text-xs text-text-tertiary mb-1">End (s)</label>
          <input
            type="number"
            min={0}
            value={endSec}
            onChange={(e) => setEndSec(e.target.value)}
            className="w-full px-3 py-2 bg-bg-primary border border-border-color text-text-primary text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
        <button
          type="button"
          onClick={handleProcess}
          disabled={!canProcess}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-bg-secondary border border-border-color text-sm font-medium text-text-secondary hover:text-link hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          {processing && <Loader2 size={14} className="animate-spin" />}
          {processing ? "Trimming…" : "Fetch & trim clip"}
        </button>
      </div>

      <p className="text-xs text-text-tertiary mt-1">
        Clip length is capped at 60s. Processing downloads the full track server-side first, so it can take up to
        about a minute — if it times out, try a shorter/lower-quality source video.
      </p>
      {error && <p className="text-xs text-carbon-support-error mt-1">{error}</p>}

      {audioUrl && !processing && (
        <div className="flex items-center gap-3 p-3 mt-3 border border-border-color bg-bg-secondary">
          {coverUrl && <img src={coverUrl} alt="" className="w-12 h-12 object-cover shrink-0" />}
          {/* eslint-disable-next-line jsx-a11y/media-has-caption -- admin preview only */}
          <audio controls src={audioUrl} className="w-full h-10" />
          <button
            type="button"
            onClick={clear}
            className="p-2 text-text-secondary hover:text-carbon-support-error transition-colors shrink-0"
            aria-label="Clear favorite track"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Submitted with the rest of the profile form, same pattern as
          FileUploadField's url input. */}
      <input type="hidden" name="favoriteTrackAudioUrl" value={audioUrl} />
      <input type="hidden" name="favoriteTrackCoverUrl" value={coverUrl} />
      <input type="hidden" name="favoriteTrackSourceUrl" value={sourceUrl} />
    </div>
  );
}
