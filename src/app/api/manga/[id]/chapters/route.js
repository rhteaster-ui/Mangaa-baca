import { NextResponse } from "next/server";

const BASE = "https://api.mangadex.org";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || 100;
    const offset = searchParams.get("offset") || 0;
    const lang = searchParams.get("lang") || "en";

    const p = new URLSearchParams();
    p.append("limit", limit);
    p.append("offset", offset);
    p.append("translatedLanguage[]", lang);
    p.append("order[chapter]", "asc");
    p.append("includes[]", "scanlation_group");

    const res = await fetch(`${BASE}/manga/${id}/feed?${p}`, {
      headers: { "User-Agent": "MangaRift/1.0" },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
