export const runtime = "edge";

export async function POST(request) {
  try {
    const { text, targetLang } = await request.json();
    if (!text?.trim()) return Response.json({ translated: "" });

    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.searchParams.set("client", "gtx");
    url.searchParams.set("sl", "auto");
    url.searchParams.set("tl", targetLang);
    url.searchParams.set("dt", "t");
    url.searchParams.set("q", text.slice(0, 4000));

    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36",
      },
    });

    if (!res.ok) {
      // fallback MyMemory
      const mm = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 500))}&langpair=auto|${targetLang}`
      );
      const mmData = await mm.json();
      return Response.json({ translated: mmData.responseData?.translatedText || text });
    }

    const data = await res.json();
    const translated = (data[0] || []).map((x) => x?.[0] || "").join("");
    return Response.json({ translated, detectedLang: data[2] });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
