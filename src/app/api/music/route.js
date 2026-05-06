import { NextResponse } from "next/server";

const FAA_YTPLAY_URL = "https://api-faa.my.id/faa/ytplay";
const DEFAULT_QUERY = "Inni uhibbuka";
const REQUEST_HEADERS = {
  Accept: "application/json, text/plain, */*",
  "User-Agent": "MangaRift/1.0 (+https://mangarift.app)",
};
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Range",
  "Cache-Control": "no-store",
};

function corsJson(body, init = {}) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      ...CORS_HEADERS,
      ...(init.headers || {}),
    },
  });
}

function getFirstString(...values) {
  return values.find((value) => typeof value === "string" && value.trim())?.trim() || "";
}

function getFirstNumber(...values) {
  const value = values.find((item) => Number.isFinite(Number(item)) && Number(item) > 0);
  return value ? Number(value) : 0;
}

function proxiedAudioUrl(url) {
  if (!url) return "";
  return `/api/music/stream?url=${encodeURIComponent(url)}`;
}

function normalizeTrack(track) {
  if (!track || typeof track !== "object") return null;

  const mp3 = getFirstString(
    track.mp3,
    track.audio,
    track.audioUrl,
    track.audio_url,
    track.play,
    track.playUrl,
    track.play_url,
    track.download,
    track.downloadUrl,
    track.download_url,
    track.dl,
    track.dl_url,
    track.url_mp3,
    track.result?.mp3,
    track.result?.audio,
    track.result?.url
  );

  if (!mp3) return null;

  const title = getFirstString(track.title, track.name, track.trackName, track.result?.title) || "Unknown Track";
  const author = getFirstString(track.author, track.artist, track.artistName, track.channel, track.result?.author) || "Unknown Artist";
  const thumbnail = getFirstString(
    track.thumbnail,
    track.thumb,
    track.image,
    track.cover,
    track.artworkUrl100,
    track.result?.thumbnail
  ) || "/favicon.png";
  const duration = getFirstNumber(track.duration, track.seconds, track.trackTimeMillis && Number(track.trackTimeMillis) / 1000);
  const streamUrl = proxiedAudioUrl(mp3);

  return {
    title,
    url: getFirstString(track.url, track.videoUrl, track.video_url, track.webpage_url),
    mp3,
    streamUrl,
    thumbnail,
    duration,
    duration_timestamp: getFirstString(track.duration_timestamp, track.timestamp) || (duration ? "" : "0:00"),
    views: getFirstNumber(track.views, track.view, track.viewCount),
    published: getFirstString(track.published, track.ago, track.uploadDate),
    author,
    trackName: title,
    artistName: author,
    artworkUrl100: thumbnail,
    previewUrl: streamUrl,
    originalPreviewUrl: mp3,
    trackTimeMillis: duration * 1000,
  };
}

function pickTrackPayload(data) {
  const candidates = [
    data?.result,
    data?.results,
    data?.data,
    data?.music,
    data?.audio,
    data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      const track = candidate.map(normalizeTrack).find(Boolean);
      if (track) return track;
      continue;
    }

    const directTrack = normalizeTrack(candidate);
    if (directTrack) return directTrack;

    if (candidate && typeof candidate === "object") {
      const nestedTrack = Object.values(candidate).map(normalizeTrack).find(Boolean);
      if (nestedTrack) return nestedTrack;
    }
  }

  return null;
}

async function fetchFaaMusic(query) {
  const url = new URL(FAA_YTPLAY_URL);
  url.searchParams.set("query", query);

  const res = await fetch(url, {
    headers: REQUEST_HEADERS,
    cache: "no-store",
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Faa API responded ${res.status}: ${text.slice(0, 120)}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Faa API returned a non-JSON response");
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || DEFAULT_QUERY).trim() || DEFAULT_QUERY;

  try {
    const data = await fetchFaaMusic(q);
    const track = pickTrackPayload(data);
    const results = track ? [track] : [];

    return corsJson({
      status: Boolean(track),
      creator: data?.creator || "Faa",
      query: q,
      result: track,
      results,
      resultCount: results.length,
      message: track ? undefined : "Faa API did not return a playable mp3 URL",
    });
  } catch (e) {
    return corsJson({ status: false, error: e.message, query: q, results: [], resultCount: 0 }, { status: 200 });
  }
}
