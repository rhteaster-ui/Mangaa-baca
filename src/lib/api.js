const BASE = "https://api.mangadex.org";

export async function fetchMangaList({ limit = 20, offset = 0, order = "latestUploadedChapter" } = {}) {
  const params = new URLSearchParams({
    limit,
    offset,
    "order[latestUploadedChapter]": order === "latestUploadedChapter" ? "desc" : undefined,
    "order[followedCount]": order === "followedCount" ? "desc" : undefined,
    "order[rating]": order === "rating" ? "desc" : undefined,
    "includes[]": "cover_art",
    "availableTranslatedLanguage[]": "en",
    "contentRating[]": ["safe", "suggestive"],
  });
  // clean undefined
  for (const [k, v] of [...params.entries()]) {
    if (v === "undefined") params.delete(k);
  }
  const res = await fetch(`${BASE}/manga?${params}`, { next: { revalidate: 300 } });
  return res.json();
}

export async function searchManga({ query, limit = 24, offset = 0 } = {}) {
  const params = new URLSearchParams({
    title: query,
    limit,
    offset,
    "includes[]": "cover_art",
    "availableTranslatedLanguage[]": "en",
    "contentRating[]": ["safe", "suggestive"],
  });
  const res = await fetch(`${BASE}/manga?${params}`, { next: { revalidate: 60 } });
  return res.json();
}

export async function getManga(id) {
  const res = await fetch(`${BASE}/manga/${id}?includes[]=cover_art&includes[]=author&includes[]=artist`, {
    next: { revalidate: 600 },
  });
  return res.json();
}

export async function getMangaChapters(id, { limit = 100, offset = 0, lang = "en" } = {}) {
  const params = new URLSearchParams({
    limit,
    offset,
    "translatedLanguage[]": lang,
    "order[chapter]": "asc",
    "includes[]": "scanlation_group",
  });
  const res = await fetch(`${BASE}/manga/${id}/feed?${params}`, { next: { revalidate: 300 } });
  return res.json();
}

export async function getChapterPages(chapterId) {
  const res = await fetch(`${BASE}/at-home/server/${chapterId}`, { next: { revalidate: 3600 } });
  return res.json();
}

export function getCoverUrl(mangaId, coverId, size = ".512.jpg") {
  return `https://uploads.mangadex.org/covers/${mangaId}/${coverId}${size}`;
}

export function extractCover(manga) {
  const rel = manga.relationships?.find((r) => r.type === "cover_art");
  if (!rel?.attributes?.fileName) return null;
  return getCoverUrl(manga.id, rel.attributes.fileName);
}

export function getTitle(manga) {
  const t = manga.attributes?.title;
  return t?.en || t?.ja || t?.["ja-ro"] || Object.values(t || {})[0] || "Unknown";
}

export function getDescription(manga) {
  const d = manga.attributes?.description;
  return d?.en || Object.values(d || {})[0] || "";
}
