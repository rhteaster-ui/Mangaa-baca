import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

const MDEX = "https://api.mangadex.org";
const HEADERS = { "User-Agent": "MangaRift/1.0" };

function getTitle(manga) {
  const t = manga.attributes?.title;
  return t?.en || t?.["ja-ro"] || t?.ja || Object.values(t || {})[0] || "Unknown";
}

function getCover(manga) {
  const rel = manga.relationships?.find((r) => r.type === "cover_art");
  const fileName = rel?.attributes?.fileName;
  if (!fileName) return null;
  const originalUrl = `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.512.jpg`;
  return `/api/proxy/cover?url=${encodeURIComponent(originalUrl)}`;
}

function getAuthors(manga) {
  return manga.relationships
    ?.filter((r) => r.type === "author" || r.type === "artist")
    .map((r) => r.attributes?.name)
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i)
    .join(", ");
}

const STATUS = {
  ongoing:   { label: "Ongoing",   color: "#22c55e" },
  completed: { label: "Completed", color: "#f59e0b" },
  hiatus:    { label: "Hiatus",    color: "#f59e0b" },
  cancelled: { label: "Cancelled", color: "#ef4444" },
};

async function getData(id) {
  const [mangaRes, chaptersRes] = await Promise.all([
    fetch(`${MDEX}/manga/${id}?includes[]=cover_art&includes[]=author&includes[]=artist`, {
      headers: HEADERS, next: { revalidate: 600 },
    }),
    fetch(
      `${MDEX}/manga/${id}/feed?limit=500&translatedLanguage[]=en&order[chapter]=asc&includes[]=scanlation_group`,
      { headers: HEADERS, next: { revalidate: 300 } }
    ),
  ]);
  return {
    manga: await mangaRes.json(),
    chapters: await chaptersRes.json(),
  };
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await fetch(
      `${MDEX}/manga/${id}?includes[]=cover_art`,
      { headers: HEADERS, next: { revalidate: 600 } }
    );
    const data = await res.json();
    return { title: `${getTitle(data.data)} — MangaRift` };
  } catch { return { title: "MangaRift" }; }
}

export default async function MangaDetailPage({ params }) {
  const { id } = await params;
  const { manga: mangaData, chapters: chaptersData } = await getData(id);

  const manga = mangaData?.data;
  if (!manga) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 px-4">
        <p className="text-5xl">😢</p>
        <p className="text-gray-400">Manga tidak ditemukan</p>
        <Link href="/" className="text-sm px-4 py-2 rounded-xl text-white" style={{ background: "#f59e0b" }}>
          ← Kembali ke Home
        </Link>
      </div>
    );
  }

  const title   = getTitle(manga);
  const cover   = getCover(manga);
  const desc    = manga.attributes?.description?.en || Object.values(manga.attributes?.description || {})[0] || "";
  const status  = manga.attributes?.status;
  const statusInfo = STATUS[status] || { label: status || "Unknown", color: "#6b7280" };
  const authors = getAuthors(manga);
  const genres  = manga.attributes?.tags
    ?.filter((t) => t.attributes?.group === "genre")
    .map((t) => t.attributes?.name?.en)
    .filter(Boolean).slice(0, 8) || [];
  const lang = manga.attributes?.originalLanguage;
  const typeLabel = lang === "ko" ? "Manhwa 🇰🇷" : lang === "zh" || lang === "zh-hk" ? "Manhua 🇨🇳" : "Manga 🇯🇵";
  const year   = manga.attributes?.year;
  const rating = manga.attributes?.rating?.bayesian?.toFixed(1);
  const chapters = chaptersData?.data || [];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Banner */}
      <div className="relative h-52 overflow-hidden">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={title} className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "blur(10px) brightness(0.25)", transform: "scale(1.12)" }} />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top,#0a0c10 30%,transparent)" }} />
        <Link href="/"
          className="absolute top-4 left-4 flex items-center gap-2 text-sm text-white px-3 py-1.5 rounded-xl"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          ← Home
        </Link>
      </div>

      <div className="px-4 -mt-20 relative z-10 pb-6">
        {/* Cover + Info */}
        <div className="flex gap-4 mb-5">
          <div className="flex-shrink-0 w-28 rounded-xl overflow-hidden shadow-2xl"
            style={{ border: "2px solid rgba(99,102,241,0.4)", aspectRatio: "2/3" }}>
            {cover
              ? <Image src={cover} alt={title} width={112} height={168} className="w-full h-full object-cover" unoptimized />
              : <div className="w-full h-full flex items-center justify-center text-3xl" style={{ background: "#1a1d2b" }}>📚</div>
            }
          </div>
          <div className="flex-1 min-w-0 pt-16">
            <p className="text-[10px] font-bold mb-1" style={{ color: "#f59e0b" }}>{typeLabel}</p>
            <h1 className="text-lg font-bold text-white leading-snug mb-1">{title}</h1>
            {authors && <p className="text-xs mb-2" style={{ color: "#6b7280" }}>{authors}</p>}
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: `${statusInfo.color}22`, color: statusInfo.color, border: `1px solid ${statusInfo.color}44` }}>
                {statusInfo.label}
              </span>
              {year && <span className="text-[10px]" style={{ color: "#6b7280" }}>{year}</span>}
              {rating && <span className="text-[10px] text-yellow-400">⭐ {rating}</span>}
            </div>
          </div>
        </div>

        {/* Buttons */}
        {chapters.length > 0 && (
          <div className="flex gap-2 mb-5">
            <Link href={`/manga/${id}/chapter/${chapters[0].id}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-semibold text-white active:scale-95 transition-all"
              style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)" }}>
              📖 Baca dari Awal
            </Link>
            {chapters.length > 1 && (
              <Link href={`/manga/${id}/chapter/${chapters[chapters.length - 1].id}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#d1d5db" }}>
                ⏭ Chapter Terbaru
              </Link>
            )}
          </div>
        )}

        {/* Genres */}
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {genres.map((g) => (
              <span key={g} className="text-[10px] px-2.5 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#9ca3af" }}>
                {g}
              </span>
            ))}
          </div>
        )}

        {/* Synopsis */}
        {desc && (
          <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#f59e0b" }}>Sinopsis</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>{desc.slice(0, 400)}{desc.length > 400 ? "..." : ""}</p>
          </div>
        )}

        {/* Chapter List */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ background: "rgba(255,255,255,0.04)" }}>
            <h3 className="text-sm font-semibold text-white">📑 Daftar Chapter</h3>
            <span className="text-xs" style={{ color: "#6b7280" }}>{chapters.length} chapter</span>
          </div>

          <div style={{ maxHeight: "450px", overflowY: "auto" }}>
            {chapters.length === 0 ? (
              <div className="text-center py-8 text-sm" style={{ color: "#6b7280" }}>
                Belum ada chapter tersedia (Bahasa Inggris)
              </div>
            ) : (
              [...chapters].reverse().map((ch) => {
                const chNum   = ch.attributes?.chapter;
                const chTitle = ch.attributes?.title;
                const group   = ch.relationships?.find((r) => r.type === "scanlation_group")?.attributes?.name;
                const pages   = ch.attributes?.pages;
                const date    = ch.attributes?.publishAt
                  ? new Date(ch.attributes.publishAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                  : "";

                return (
                  <Link
                    key={ch.id}
                    href={`/manga/${id}/chapter/${ch.id}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-white/4 transition-colors group"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-200 group-hover:text-indigo-300 transition-colors truncate">
                        Ch.{chNum || "?"}
                        {chTitle ? ` — ${chTitle}` : ""}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: "#4b5563" }}>
                        {group || "Unknown"} · {pages || 0} hal · {date}
                      </p>
                    </div>
                    <ChevronRight size={15} className="text-gray-600 group-hover:text-indigo-400 flex-shrink-0 ml-2" />
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
