"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

interface FavoriteTrackProps {
  audioUrl: string;
  coverUrl: string | null;
  title: string | null;
  artist: string | null;
  label: string | null;
  // Passed as "flex-1" by Hero so this whole component (not just the
  // controls row) grows to fill the remaining height in its flex column —
  // the actual card below stretches with it (see its own flex-1) and
  // vertically centers its (still compact) controls within the extra
  // height, rather than the controls themselves getting stretched/blown up.
  className?: string;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Fully custom player for the Hero's "favorite track" slot. The clip is a
// plain self-hosted mp3 (downloaded from a YouTube link via yt-dlp, trimmed
// with ffmpeg, re-hosted in our own storage — see FavoriteTrackField +
// handleProcessFavoriteTrack), so this is just a bare <audio> element under
// the hood with our own controls on top, not a third-party embed. The play
// button deliberately reuses the exact button treatment the "Download CV"
// button uses above it (border-link, hover:bg-link-subtle) so it reads as
// part of the same Hero, not an inserted widget.
export default function FavoriteTrack({ audioUrl, coverUrl, title, artist, label, className = "mt-6" }: FavoriteTrackProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration);
    const onEnd = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  return (
    // No max-w-md cap (unlike heroMotto/etc. above it) — this spans the
    // full width of the text column, deliberately wider than the rest of
    // the column's content, rather than reading as a narrow inserted box.
    <div className={`w-full flex flex-col ${className}`}>
      {label && <p className="text-xs sm:text-sm text-text-tertiary mb-2 shrink-0">{label}</p>}

      <div className="flex-1 flex items-center gap-3 p-3 border border-border-color">
        {coverUrl && <img src={coverUrl} alt="" className="w-12 h-12 object-cover grayscale shrink-0" />}

        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className="shrink-0 w-8 h-8 flex items-center justify-center border border-link text-link hover:bg-link-subtle transition-colors"
        >
          {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
        </button>

        <div className="flex-1 min-w-0">
          {(title || artist) && (
            <p className="text-sm font-semibold text-text-primary truncate">
              {title}
              {title && artist && <span className="text-text-tertiary font-normal"> — {artist}</span>}
              {!title && artist}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              aria-label="Seek"
              className="flex-1 accent-link h-1"
            />
            <span className="text-xs text-text-tertiary tabular-nums shrink-0">
              {formatTime(currentTime)}/{formatTime(duration)}
            </span>
          </div>
        </div>
      </div>

      {/* eslint-disable-next-line jsx-a11y/media-has-caption -- short instrumental-adjacent preview clip, no captions to provide */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" className="hidden" />
    </div>
  );
}
