const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Range",
};
const FORWARDED_HEADERS = ["content-type", "content-length", "content-range", "accept-ranges"];

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function responseHeaders(upstream) {
  const headers = new Headers(CORS_HEADERS);

  FORWARDED_HEADERS.forEach((name) => {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  });

  if (!headers.has("content-type")) headers.set("content-type", "audio/mpeg");
  headers.set("Cache-Control", "public, max-age=3600");

  return headers;
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const audioUrl = searchParams.get("url") || "";

  if (!isHttpUrl(audioUrl)) {
    return Response.json({ error: "Missing or invalid audio URL" }, { status: 400, headers: CORS_HEADERS });
  }

  try {
    const range = request.headers.get("range");
    const upstream = await fetch(audioUrl, {
      headers: {
        Accept: "audio/*,*/*;q=0.8",
        "User-Agent": "MangaRift/1.0 (+https://mangarift.app)",
        ...(range ? { Range: range } : {}),
      },
      cache: "no-store",
    });

    if (!upstream.ok && upstream.status !== 206) {
      return Response.json(
        { error: `Audio source responded ${upstream.status}` },
        { status: 502, headers: CORS_HEADERS }
      );
    }

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders(upstream),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 502, headers: CORS_HEADERS });
  }
}
