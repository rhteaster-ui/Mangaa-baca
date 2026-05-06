export const runtime = "edge";

// Allowed domains for manga page images
const ALLOWED = [
  "uploads.mangadex.org",
  "mangadex.network",
  "cmdxd98sb0x3yprd.mangadex.network",
];

function isAllowed(url) {
  try {
    const { hostname } = new URL(url);
    return ALLOWED.some((d) => hostname === d || hostname.endsWith("." + d));
  } catch {
    return false;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url || !isAllowed(url)) {
    return new Response("Invalid URL", { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "MangaRift/1.0",
        Referer: "https://mangadex.org",
      },
    });

    if (!response.ok) {
      return new Response("Failed to fetch image", { status: response.status });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
        // CORS headers so canvas can read pixels
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response("Proxy error", { status: 500 });
  }
}
