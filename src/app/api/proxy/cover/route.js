export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url || !url.startsWith("https://uploads.mangadex.org")) {
    return new Response("Invalid URL", { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "MangaRift/1.0",
        "Referer": "https://mangadex.org",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response("Error fetching image", { status: 500 });
  }
}
