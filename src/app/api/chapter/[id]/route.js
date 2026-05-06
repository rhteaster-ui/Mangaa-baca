import { NextResponse } from "next/server";

const BASE = "https://api.mangadex.org";

export async function GET(_, { params }) {
  try {
    const { id } = await params;
    const res = await fetch(`${BASE}/at-home/server/${id}`, {
      headers: { "User-Agent": "MangaRift/1.0" },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
