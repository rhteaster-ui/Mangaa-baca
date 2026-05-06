"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d} hari lalu`;
  if (h > 0) return `${h} jam lalu`;
  if (m > 0) return `${m} menit lalu`;
  return "Baru saja";
}

export default function LibraryPage() {
  const [history, setHistory] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [tab, setTab] = useState("history"); // "history" | "recent"

  useEffect(() => {
    setHydrated(true);
    try {
      const raw = localStorage.getItem("mr_history");
      const arr = raw ? JSON.parse(raw) : [];
      // Deduplicate by mangaId (keep latest)
      const map = new Map();
      for (const item of arr) {
        if (!map.has(item.mangaId) || map.get(item.mangaId).readAt < item.readAt) {
          map.set(item.mangaId, item);
        }
      }
      setHistory([...map.values()].sort((a, b) => b.readAt - a.readAt));
    } catch {
      setHistory([]);
    }
  }, []);

  function clearHistory() {
    localStorage.removeItem("mr_history");
    setHistory([]);
  }

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-7 h-7 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold text-white">Library</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>Riwayat &amp; Koleksi Bacaan</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-xs px-3 py-1.5 rounded-xl transition-all"
            style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            Hapus Semua
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { key: "history", label: "Riwayat Baca" },
          { key: "recent", label: "Lanjut Baca" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="text-xs px-4 py-2 rounded-full transition-all font-medium"
            style={{
              background: tab === t.key ? "linear-gradient(135deg,#f59e0b,#ef4444)" : "rgba(255,255,255,0.05)",
              color: tab === t.key ? "#080a0f" : "#9ca3af",
              border: tab === t.key ? "none" : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: "rgba(245,158,11,0.08)" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-white font-semibold mb-1">Library Kosong</p>
            <p className="text-sm" style={{ color: "#6b7280" }}>Mulai baca manga untuk melihat riwayat di sini</p>
          </div>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            Jelajah Manga
          </Link>
        </div>
      ) : tab === "history" ? (
        /* History list */
        <div className="space-y-3">
          <p className="text-xs mb-3" style={{ color: "#4b5563" }}>{history.length} manga dibaca</p>
          {history.map((item) => (
            <Link
              key={item.mangaId}
              href={`/manga/${item.mangaId}`}
              className="flex items-center gap-3 p-3 rounded-2xl transition-all group"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              {/* Cover */}
              <div className="relative w-14 flex-shrink-0 rounded-xl overflow-hidden" style={{ aspectRatio: "2/3" }}>
                {item.cover ? (
                  <Image src={item.cover} alt={item.title || ""} fill sizes="56px" className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: "#141720" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                  {item.title || "Unknown Manga"}
                </p>
                {item.chapterNum && (
                  <p className="text-xs mt-1" style={{ color: "#f59e0b" }}>
                    Chapter {item.chapterNum}
                  </p>
                )}
                <p className="text-[11px] mt-0.5" style={{ color: "#4b5563" }}>
                  {timeAgo(item.readAt)}
                </p>
              </div>

              {/* Arrow */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 group-hover:stroke-amber-400 transition-colors">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </Link>
          ))}
        </div>
      ) : (
        /* Continue reading — show last chapter links */
        <div className="space-y-3">
          <p className="text-xs mb-3" style={{ color: "#4b5563" }}>Lanjutkan dari chapter terakhir</p>
          {history.slice(0, 10).map((item) => (
            <Link
              key={item.mangaId}
              href={item.chapterId ? `/manga/${item.mangaId}/chapter/${item.chapterId}` : `/manga/${item.mangaId}`}
              className="flex items-center gap-3 p-3 rounded-2xl transition-all group"
              style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.1)" }}
            >
              <div className="relative w-14 flex-shrink-0 rounded-xl overflow-hidden" style={{ aspectRatio: "2/3" }}>
                {item.cover ? (
                  <Image src={item.cover} alt={item.title || ""} fill sizes="56px" className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: "#141720" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-1">{item.title || "Unknown"}</p>
                <p className="text-xs mt-1 flex items-center gap-1.5" style={{ color: "#f59e0b" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="5 3 19 12 5 21"/></svg>
                  Lanjut Chapter {item.chapterNum || "—"}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: "#4b5563" }}>{timeAgo(item.readAt)}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
