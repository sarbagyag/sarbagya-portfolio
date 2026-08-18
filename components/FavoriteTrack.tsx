"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { toSpotifyEmbedUrl } from "@/lib/spotify";

// Small Spotify embed for the Hero's "favorite track" slot — set from
// /admin/profile (favoriteTrackUrl/favoriteTrackLabel). Renders nothing
// until a URL is configured, and nothing if it doesn't parse as a Spotify
// track/episode link (validated on save, but defends against stale data).
//
// This is Spotify's own official player widget (open.spotify.com/embed/...),
// not a custom-built one — it needs no API key, no audio hosting, and gives
// a real 30s preview (or full playback for a visitor logged into Spotify).
// Client component because the embed's dark/light theme has to track ours.
export default function FavoriteTrack({ url, label }: { url: string; label: string | null }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="mt-6 h-[152px] max-w-md" aria-hidden="true" />;
  }

  const embedUrl = toSpotifyEmbedUrl(url, resolvedTheme === "dark" ? "dark" : "light");
  if (!embedUrl) return null;

  return (
    <div className="mt-6 max-w-md">
      <p className="text-xs sm:text-sm text-text-tertiary mb-2">{label || "Favorite track"}</p>
      <iframe
        title="Favorite track"
        src={embedUrl}
        width="100%"
        height="152"
        style={{ border: 0 }}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}
