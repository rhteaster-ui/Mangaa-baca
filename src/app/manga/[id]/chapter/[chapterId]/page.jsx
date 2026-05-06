"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft, ChevronRight, List, X, Loader2, ArrowLeft,
  Globe, ChevronDown, Languages, ImageIcon, AlignLeft,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { toast } from "sonner";

const MangaTranslator = dynamic(() => import("@/components/MangaTranslator"), { ssr: false });

const LANGUAGES = [
  { code: "id", label: "Indonesia 🇮🇩" },
  { code: "en", label: "English 🇬🇧" },
  { code: "ms", label: "Melayu 🇲🇾" },
  { code: "tl", label: "Filipino 🇵🇭" },
  { code: "th", label: "Thai 🇹🇭" },
  { code: "vi", label: "Vietnam 🇻🇳" },
  { code: "es", label: "Español 🇪🇸" },
  { code: "pt", label: "Português 🇧🇷" },
  { code: "fr", label: "Français 🇫🇷" },
  { code: "de", label: "Deutsch 🇩🇪" },
  { code: "ru", label: "Русский 🇷🇺" },
  { code: "ar", label: "العربية 🇸🇦" },
  { code: "hi", label: "Hindi 🇮🇳" },
  { code: "ko", label: "한국어 🇰🇷" },
  { code: "zh", label: "中文 🇨🇳" },
];

// translate mode: 'off' | 'overlay' (gambar diterjemahkan)
export default function ChapterReader() {
  const { id: mangaId, chapterId } = useParams();
  const router = useRouter();

  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chapterList, setChapterList] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const [showChapterList, setShowChapterList] = useState(false);
  const [readMode, setReadMode] = useState("scroll");
  const [currentPage, setCurrentPage] = useState(0);
  const hideTimer = useRef(null);

  // Translate states
  const [translateMode, setTranslateMode] = useState("off"); // 'off' | 'overlay'
  const [selectedLang, setSelectedLang] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("sm_lang") || "id"
      : "id"
  );
  const [showLangPicker, setShowLangPicker] = useState(false);
  // Track which pages have been translated (for cache key)
  const [translateKey, setTranslateKey] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setPages([]);
      setCurrentPage(0);
      setTranslateMode("off");
      try {
        const res = await fetch(`/api/chapter/${chapterId}`);
        const data = await res.json();
        if (data.chapter) {
          const { baseUrl, chapter } = data;
          setPages(chapter.data.map((f) => `${baseUrl}/data/${chapter.hash}/${f}`));
          setCurrentChapter(data.chapter);
          // Save reading history to localStorage
          try {
            const mangaRes = await fetch(`/api/manga/${mangaId}`);
            const mangaData = await mangaRes.json();
            const manga = mangaData.data;
            const titleObj = manga?.attributes?.title || {};
            const title = titleObj.en || titleObj["ja-ro"] || Object.values(titleObj)[0] || "";
            const coverRel = manga?.relationships?.find((r) => r.type === "cover_art");
            const coverFile = coverRel?.attributes?.fileName;
            const cover = coverFile ? `/api/proxy/cover?url=${encodeURIComponent(`https://uploads.mangadex.org/covers/${mangaId}/${coverFile}.512.jpg`)}` : null;
            const chNum = data.chapter?.chapter || "";
            const raw = localStorage.getItem("mr_history");
            const arr = raw ? JSON.parse(raw) : [];
            const filtered = arr.filter((x) => x.mangaId !== mangaId);
            filtered.push({ mangaId, chapterId, title, cover, chapterNum: chNum, readAt: Date.now() });
            localStorage.setItem("mr_history", JSON.stringify(filtered.slice(-100)));
          } catch (_) {}
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, [chapterId]);

  useEffect(() => {
    async function loadChapters() {
      try {
        const res = await fetch(`/api/manga/${mangaId}/chapters?limit=500`);
        const data = await res.json();
        setChapterList(data.data || []);
      } catch (e) { console.error(e); }
    }
    loadChapters();
  }, [mangaId]);

  useEffect(() => {
    if (showControls) {
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(hideTimer.current);
  }, [showControls]);

  const currentIdx = chapterList.findIndex((c) => c.id === chapterId);
  const prevChapter = currentIdx < chapterList.length - 1 ? chapterList[currentIdx + 1] : null;
  const nextChapter = currentIdx > 0 ? chapterList[currentIdx - 1] : null;
  const chapterNum = currentChapter?.chapter || chapterList[currentIdx]?.attributes?.chapter;

  function toggleControls() { setShowControls((v) => !v); }

  function handlePageClick(e) {
    if (readMode !== "page") { toggleControls(); return; }
    const x = e.clientX, w = window.innerWidth;
    if (x < w * 0.35) setCurrentPage((p) => Math.max(0, p - 1));
    else if (x > w * 0.65) setCurrentPage((p) => Math.min(pages.length - 1, p + 1));
    else toggleControls();
  }

  function activateTranslate(lang) {
    const l = lang || selectedLang;
    setSelectedLang(l);
    if (typeof window !== "undefined") localStorage.setItem("sm_lang", l);
    setTranslateMode("overlay");
    setTranslateKey((k) => k + 1);
    setShowLangPicker(false);
    setShowChapterList(false);
    const label = LANGUAGES.find((x) => x.code === l)?.label || l;
    toast(`🌐 Mode terjemahan aktif — ${label}`, { duration: 2500 });
  }

  function selectLang(code) {
    setSelectedLang(code);
    if (typeof window !== "undefined") localStorage.setItem("sm_lang", code);
    setShowLangPicker(false);
    if (translateMode === "overlay") {
      setTranslateKey((k) => k + 1);
      const label = LANGUAGES.find((x) => x.code === code)?.label || code;
      toast(`🌐 Bahasa diganti ke ${label}`, { duration: 2000 });
    }
  }

  const selectedLangLabel = LANGUAGES.find((l) => l.code === selectedLang)?.label || selectedLang;
  const isTranslating = translateMode === "overlay";

  // Render a single page: either original <img> or MangaTranslator canvas
  function renderPage(src, idx) {
    if (translateMode === "overlay") {
      return (
        <div key={`${translateKey}-${idx}`} className="w-full" style={{ maxWidth: 800 }}>
          <MangaTranslator
            imageUrl={src}
            targetLang={selectedLang}
          />
        </div>
      );
    }
    return (
      <img
        key={idx}
        src={src}
        alt={`Page ${idx + 1}`}
        className="chapter-img"
        style={{ maxWidth: 800 }}
        loading={idx < 3 ? "eager" : "lazy"}
        onLoad={() => setCurrentPage(idx)}
      />
    );
  }

  return (
    <div className="min-h-screen relative select-none" style={{ background: "#0a0a0a" }}>

      {/* ── TOP BAR ── */}
      <div
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          transform: showControls ? "translateY(0)" : "translateY(-100%)",
          background: "linear-gradient(to bottom,rgba(0,0,0,0.95),transparent)",
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          <Link
            href={`/manga/${mangaId}`}
            className="w-9 h-9 flex items-center justify-center rounded-full text-white"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="flex-1 text-center">
            <p className="text-xs font-semibold text-white">Chapter {chapterNum || "?"}</p>
            {isTranslating && (
              <p className="text-[10px]" style={{ color: "#818cf8" }}>
                🌐 {selectedLangLabel}
              </p>
            )}
            {readMode === "page" && !isTranslating && (
              <p className="text-[10px] text-gray-400">{currentPage + 1} / {pages.length}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Read mode */}
            <button
              onClick={() => setReadMode((m) => m === "scroll" ? "page" : "scroll")}
              className="w-9 h-9 flex items-center justify-center rounded-full text-white text-xs"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              {readMode === "scroll" ? "📜" : "📄"}
            </button>
            {/* Menu */}
            <button
              onClick={() => setShowChapterList(true)}
              className="w-9 h-9 flex items-center justify-center rounded-full text-white relative"
              style={{ background: isTranslating ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.1)" }}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          transform: showControls ? "translateY(0)" : "translateY(100%)",
          background: "linear-gradient(to top,rgba(0,0,0,0.95),transparent)",
        }}
      >
        <div className="flex items-center justify-between px-4 py-4 gap-3">
          <button
            onClick={() => prevChapter && router.push(`/manga/${mangaId}/chapter/${prevChapter.id}`)}
            disabled={!prevChapter}
            className="flex items-center gap-1 text-xs font-semibold px-4 py-2.5 rounded-xl text-white disabled:opacity-30"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.15)" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: pages.length > 0 ? `${((currentPage + 1) / pages.length) * 100}%` : "0%",
                background: "linear-gradient(90deg,#f59e0b,#ef4444)",
              }}
            />
          </div>
          <button
            onClick={() => nextChapter && router.push(`/manga/${mangaId}/chapter/${nextChapter.id}`)}
            disabled={!nextChapter}
            className="flex items-center gap-1 text-xs font-semibold px-4 py-2.5 rounded-xl text-white disabled:opacity-30"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ── LANGUAGE PICKER ── */}
      {showLangPicker && (
        <div
          className="fixed inset-0 z-[300] flex items-end"
          style={{ background: "rgba(0,0,0,0.75)" }}
          onClick={() => setShowLangPicker(false)}
        >
          <div
            className="w-full rounded-t-2xl flex flex-col"
            style={{ background: "#12141c", maxHeight: "70vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
              style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-2">
                <Languages size={16} className="text-indigo-400" />
                <p className="text-sm font-semibold text-white">Pilih Bahasa Terjemahan</p>
              </div>
              <button onClick={() => setShowLangPicker(false)} className="text-gray-400"><X size={18} /></button>
            </div>
            <div className="overflow-y-auto flex-1 py-2">
              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === selectedLang;
                return (
                  <button
                    key={lang.code}
                    onClick={() => selectLang(lang.code)}
                    className="w-full flex items-center justify-between px-5 py-3"
                    style={{ background: isSelected ? "rgba(99,102,241,0.15)" : "transparent" }}
                  >
                    <p className="text-sm" style={{ color: isSelected ? "#818cf8" : "#e5e7eb" }}>{lang.label}</p>
                    {isSelected && <span className="text-indigo-400 font-bold text-sm">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── MENU DRAWER (garis tiga) ── */}
      {showChapterList && (
        <div
          className="fixed inset-0 z-[200] flex"
          onClick={() => setShowChapterList(false)}
        >
          <div className="flex-1" />
          <div
            className="w-72 h-full flex flex-col"
            style={{ background: "#12141c", borderLeft: "1px solid rgba(255,255,255,0.07)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b flex-shrink-0"
              style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <p className="text-sm font-semibold text-white">Menu</p>
              <button onClick={() => setShowChapterList(false)} className="text-gray-400"><X size={18} /></button>
            </div>

            {/* ── TRANSLATE SECTION ── */}
            <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3">
                🌐 Terjemahkan Manga
              </p>

              {/* Mode cards */}
              <div className="flex flex-col gap-2 mb-3">
                {/* OFF */}
                <button
                  onClick={() => { setTranslateMode("off"); setShowChapterList(false); toast("🖼️ Kembali ke gambar asli", { duration: 2000 }); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                  style={{
                    background: translateMode === "off"
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(255,255,255,0.03)",
                    border: translateMode === "off"
                      ? "1px solid rgba(255,255,255,0.15)"
                      : "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <ImageIcon size={16} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-white">Gambar Asli</p>
                    <p className="text-[10px] text-gray-500">Tanpa terjemahan</p>
                  </div>
                  {translateMode === "off" && <span className="ml-auto text-indigo-400 text-xs">✓</span>}
                </button>

                {/* OVERLAY */}
                <button
                  onClick={() => activateTranslate(selectedLang)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                  style={{
                    background: translateMode === "overlay"
                      ? "rgba(99,102,241,0.15)"
                      : "rgba(255,255,255,0.03)",
                    border: translateMode === "overlay"
                      ? "1px solid rgba(99,102,241,0.4)"
                      : "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <Globe size={16} className="text-indigo-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: translateMode === "overlay" ? "#818cf8" : "#fff" }}>
                      Terjemahkan Gambar
                    </p>
                    <p className="text-[10px] text-gray-500">
                      Teks di gambar langsung diterjemahkan
                    </p>
                  </div>
                  {translateMode === "overlay" && <span className="ml-auto text-indigo-400 text-xs">✓</span>}
                </button>
              </div>

              {/* Language picker button */}
              <button
                onClick={() => { setShowChapterList(false); setShowLangPicker(true); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Languages size={13} className="text-indigo-400" />
                  <span className="text-xs text-gray-300">{selectedLangLabel}</span>
                </div>
                <ChevronDown size={13} className="text-gray-500" />
              </button>
            </div>

            {/* ── CHAPTER LIST ── */}
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-4 pt-3 pb-1 flex-shrink-0">
              Daftar Chapter
            </p>
            <div className="flex-1 overflow-y-auto">
              {[...chapterList].reverse().map((ch) => {
                const isActive = ch.id === chapterId;
                return (
                  <Link
                    key={ch.id}
                    href={`/manga/${mangaId}/chapter/${ch.id}`}
                    onClick={() => setShowChapterList(false)}
                    className="flex items-center px-4 py-3 text-sm"
                    style={{
                      background: isActive ? "rgba(99,102,241,0.15)" : "transparent",
                      color: isActive ? "#818cf8" : "#9ca3af",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2 flex-shrink-0" />}
                    Chapter {ch.attributes?.chapter || "?"}
                    {ch.attributes?.title ? ` — ${ch.attributes.title}` : ""}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── LOADING ── */}
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-3">
          <Loader2 size={36} className="animate-spin text-indigo-400" />
          <p className="text-sm text-gray-500">Memuat chapter...</p>
        </div>
      )}

      {/* ── PAGES ── */}
      {!loading && pages.length > 0 && (
        <div onClick={handlePageClick}>
          {readMode === "scroll" ? (
            <div className="flex flex-col items-center pt-14 pb-20">
              {pages.map((src, i) => renderPage(src, i))}
              <div className="flex flex-col items-center gap-4 py-10 px-4">
                <p className="text-sm text-gray-400">— Selesai Chapter {chapterNum} —</p>
                <div className="flex gap-3">
                  {prevChapter && (
                    <Link href={`/manga/${mangaId}/chapter/${prevChapter.id}`}
                      className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white"
                      style={{ background: "rgba(255,255,255,0.1)" }}>
                      ← Prev
                    </Link>
                  )}
                  <Link href={`/manga/${mangaId}`}
                    className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white"
                    style={{ background: "rgba(255,255,255,0.1)" }}>
                    📚 Detail
                  </Link>
                  {nextChapter && (
                    <Link href={`/manga/${mangaId}/chapter/${nextChapter.id}`}
                      className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white"
                      style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)" }}>
                      Next →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-screen pt-14 pb-20">
              {translateMode === "overlay" ? (
                <div className="w-full" style={{ maxWidth: 800 }}>
                  <MangaTranslator
                    key={`${translateKey}-${currentPage}`}
                    imageUrl={pages[currentPage]}
                    targetLang={selectedLang}
                  />
                </div>
              ) : (
                <img
                  src={pages[currentPage]}
                  alt={`Page ${currentPage + 1}`}
                  className="max-w-full max-h-screen object-contain"
                  loading="eager"
                />
              )}
            </div>
          )}
        </div>
      )}

      {!loading && pages.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-3">
          <p className="text-4xl">😢</p>
          <p className="text-gray-400 text-sm">Halaman tidak bisa dimuat</p>
          <Link href={`/manga/${mangaId}`} className="text-indigo-400 text-sm">← Kembali</Link>
        </div>
      )}
    </div>
  );
}
