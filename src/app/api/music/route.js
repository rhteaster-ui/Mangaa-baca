import { NextResponse } from "next/server";

function normalizeTrack(track) {
  if (!track?.mp3) return null;

  return {
    title: track.title || "Unknown Track",
    url: track.url || "",
    mp3: track.mp3,
    thumbnail: track.thumbnail || "/favicon.png",
    duration: track.duration || 0,
    duration_timestamp: track.duration_timestamp || "0:00",
    views: track.views || 0,
    published: track.published || "",
    author: track.author || "Unknown Artist",
    trackName: track.title || "Unknown Track",
    artistName: track.author || "Unknown Artist",
    artworkUrl100: track.thumbnail || "/favicon.png",
    previewUrl: track.mp3,
    trackTimeMillis: (track.duration || 0) * 1000,
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "Inni uhibbuka";

  try {
    const res = await fetch(
      `https://api-faa.my.id/faa/ytplay?query=${encodeURIComponent(q)}`,
      { headers: { "User-Agent": "MangaRift/1.0" }, next: { revalidate: 0 } }
    );

    if (!res.ok) throw new Error(`API responded ${res.status}`);

    const data = await res.json();
    const track = normalizeTrack(data?.result);
    const results = track ? [track] : [];

    return NextResponse.json({
      status: Boolean(data?.status && track),
      creator: data?.creator || "Faa",
      result: track,
      results,
      resultCount: results.length,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message, results: [], resultCount: 0 }, { status: 200 });
  }
}
