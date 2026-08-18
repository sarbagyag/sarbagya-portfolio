// Turns a normal Spotify share link (open.spotify.com/track/<id>?si=...)
// into Spotify's official oEmbed player URL. No API key needed — this is a
// public, unauthenticated iframe widget Spotify hosts, so it always has a
// real preview/play button without us storing or hosting any audio.
export function toSpotifyEmbedUrl(url: string, theme: "dark" | "light"): string | null {
  const match = url.match(/open\.spotify\.com\/(track|episode)\/([a-zA-Z0-9]+)/);
  if (!match) return null;

  const [, type, id] = match;
  const params = new URLSearchParams({ utm_source: "generator" });
  if (theme === "dark") params.set("theme", "0");

  return `https://open.spotify.com/embed/${type}/${id}?${params.toString()}`;
}
