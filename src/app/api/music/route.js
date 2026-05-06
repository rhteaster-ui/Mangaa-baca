import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "Inni uhibbuka";
  try {
    const res = await fetch(
      `https://api.nexray.eu.cc/search/applemusic?q=${encodeURIComponent(q)}`,
      { headers: { "User-Agent": "MangaRift/1.0" }, next: { revalidate: 0 } }
    );
    if (!res.ok) throw new Error(`API responded ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e.message, results: [], resultCount: 0 }, { status: 200 });
  }
}
