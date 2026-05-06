import { NextResponse } from "next/server";

const BASE = "https://api.mangadex.org";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const limit = searchParams.get("limit") || 24;
    const offset = searchParams.get("offset") || 0;
    const sort = searchParams.get("sort") || "latestUploadedChapter";

    const params = new URLSearchParams();
    params.append("limit", limit);
    params.append("offset", offset);
    params.append("includes[]", "cover_art");
    params.append("availableTranslatedLanguage[]", "en");
    params.append("contentRating[]", "safe");
    params.append("contentRating[]", "suggestive");

    if (q) {
      params.append("title", q);
    } else {
      params.append(`order[${sort}]`, "desc");
    }

    const res = await fetch(`${BASE}/manga?${params}`, {
      headers: { "User-Agent": "MangaRift/1.0" },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
