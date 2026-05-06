import MangaCard from "@/components/manga-card";
import Link from "next/link";

const MDEX = "https://api.mangadex.org";

async function fetchManga(sort, limit = 18) {
  try {
    const p = new URLSearchParams();
    p.append("limit", limit);
    p.append("includes[]", "cover_art");
    p.append("availableTranslatedLanguage[]", "en");
    p.append("contentRating[]", "safe");
    p.append("contentRating[]", "suggestive");
    p.append(`order[${sort}]`, "desc");
    const res = await fetch(`${MDEX}/manga?${p}`, { headers: { "User-Agent": "MangaRift/1.0" }, next: { revalidate: 300 } });
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

export default async function HomePage() {
  const [latest, popular, topRated] = await Promise.all([
    fetchManga("latestUploadedChapter", 18),
    fetchManga("followedCount", 12),
    fetchManga("rating", 6),
  ]);

  const hero = topRated[0];
  const heroTitle = hero?.attributes?.title?.en || hero?.attributes?.title?.["ja-ro"] || Object.values(hero?.attributes?.title || {})[0] || "";
  const heroCoverRel = hero?.relationships?.find((r) => r.type === "cover_art");
  const heroCoverFileName = heroCoverRel?.attributes?.fileName;
  const heroCoverOriginal = heroCoverFileName ? `https://uploads.mangadex.org/covers/${hero.id}/${heroCoverFileName}.512.jpg` : null;
  const heroCover = heroCoverOriginal ? `/api/proxy/cover?url=${encodeURIComponent(heroCoverOriginal)}` : null;
  const heroDesc = hero?.attributes?.description?.en || Object.values(hero?.attributes?.description || {})[0] || "";

  return (
    <div>
      {/* Hero */}
      {hero && (
        <div className="relative w-full overflow-hidden" style={{ height: "340px" }}>
          {heroCover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroCover} alt={heroTitle} className="absolute inset-0 w-full h-full object-cover" style={{ filter: "blur(3px) brightness(0.3)", transform: "scale(1.08)" }} />
          )}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #080a0f 25%, transparent 70%)" }} />
          <div className="relative z-10 flex items-end h-full px-5 pb-7 max-w-2xl mx-auto gap-4">
            {heroCover && (
              <Link href={`/manga/${hero.id}`} className="flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroCover} alt={heroTitle} className="w-24 rounded-xl shadow-2xl" style={{ border: "2px solid rgba(245,158,11,0.5)", aspectRatio: "2/3", objectFit: "cover", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }} />
              </Link>
            )}
            <div className="flex-1 min-w-0">
              <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-2" style={{ background: "rgba(245,158,11,0.85)", color: "white" }}>Top Rated</span>
              <h1 className="text-xl font-bold text-white mb-1.5 line-clamp-2 leading-tight">{heroTitle}</h1>
              <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">{heroDesc}</p>
              <Link href={`/manga/${hero.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl text-white active:scale-95 transition-all" style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                Baca Sekarang
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 pt-4 pb-4 space-y-8">
        {/* Filter Chips - no emoji */}
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {[
            { label: "Terbaru", href: "/search?sort=latestUploadedChapter" },
            { label: "Populer", href: "/search?sort=followedCount" },
            { label: "Rating Tinggi", href: "/search?sort=rating" },
            { label: "Manga", href: "/search?q=action manga" },
            { label: "Manhwa", href: "/search?q=manhwa romance" },
            { label: "Manhua", href: "/search?q=manhua cultivation" },
          ].map((chip) => (
            <Link
              key={chip.href}
              href={chip.href}
              className="flex-shrink-0 text-xs px-3.5 py-1.5 rounded-full transition-all hover:text-white"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#9ca3af", whiteSpace: "nowrap" }}
            >
              {chip.label}
            </Link>
          ))}
        </div>

        {/* Update Terbaru */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Update Terbaru
            </h2>
            <Link href="/search?sort=latestUploadedChapter" className="text-xs hover:underline" style={{ color: "#f59e0b" }}>Lihat semua →</Link>
          </div>
          <div className="manga-grid">
            {latest.map((m) => <MangaCard key={m.id} manga={m} />)}
            {latest.length === 0 && <p className="text-gray-500 text-sm col-span-full text-center py-10">Gagal memuat data. Coba refresh.</p>}
          </div>
        </section>

        {/* Paling Populer */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
              Paling Populer
            </h2>
            <Link href="/search?sort=followedCount" className="text-xs hover:underline" style={{ color: "#f59e0b" }}>Lihat semua →</Link>
          </div>
          <div className="manga-grid">
            {popular.map((m) => <MangaCard key={m.id} manga={m} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
