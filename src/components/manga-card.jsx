import Link from "next/link";
import Image from "next/image";

function getTitle(manga) {
  const t = manga.attributes?.title;
  return t?.en || t?.ja || t?.["ja-ro"] || Object.values(t || {})[0] || "Unknown";
}

function getCover(manga) {
  const rel = manga.relationships?.find((r) => r.type === "cover_art");
  const fileName = rel?.attributes?.fileName;
  if (!fileName) return null;
  const originalUrl = `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.512.jpg`;
  return `/api/proxy/cover?url=${encodeURIComponent(originalUrl)}`;
}

const STATUS_COLOR = {
  ongoing: "#22c55e",
  completed: "#f59e0b",
  hiatus: "#6b7280",
  cancelled: "#ef4444",
};

export default function MangaCard({ manga }) {
  const title = getTitle(manga);
  const cover = getCover(manga);
  const status = manga.attributes?.status;
  const type = manga.attributes?.originalLanguage;

  const typeLabel = type === "ko" ? "Manhwa" : type === "zh" || type === "zh-hk" ? "Manhua" : "Manga";

  return (
    <Link href={`/manga/${manga.id}`} className="group fade-in block">
      <div className="relative rounded-xl overflow-hidden mb-2" style={{ aspectRatio: "2/3" }}>
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            sizes="180px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: "#141720" }}>
            <span className="text-4xl">📚</span>
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)" }} />

        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
            style={{ background: "rgba(245,158,11,0.85)", color: "#080a0f" }}
          >
            {typeLabel}
          </span>
        </div>

        {/* Status dot */}
        {status && (
          <div
            className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{ background: STATUS_COLOR[status] || "#6b7280" }}
            title={status}
          />
        )}
      </div>

      <p className="text-xs font-medium text-gray-200 line-clamp-2 leading-tight group-hover:text-amber-400 transition-colors">
        {title}
      </p>
    </Link>
  );
}
