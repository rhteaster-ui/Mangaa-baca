"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

function formatTime(s) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function MusicPlayer() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searching, setSearching] = useState(false);
  const [pos, setPos] = useState(null);
  const audioRef = useRef(null);
  const btnRef = useRef(null);
  const dragData = useRef({ active: false, moved: false, sx: 0, sy: 0, bx: 0, by: 0 });

  const hide = pathname === "/about" || pathname?.startsWith("/search");

  const doSearch = useCallback(async (q) => {
    setSearching(true);
    try {
      const res = await fetch(`/api/music?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      const list = data.results || data.data || [];
      setTracks(list);
      if (list.length > 0) setCurrentTrack((prev) => prev ?? list[0]);
    } catch (e) {
      console.error("music search err", e);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    doSearch("Inni uhibbuka");
  }, [doSearch]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    };
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnded = () => { setIsPlaying(false); setProgress(0); setCurrentTime(0); };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    if (!currentTrack?.previewUrl || !audioRef.current) return;
    const audio = audioRef.current;
    audio.src = currentTrack.previewUrl;
    audio.load();
    setProgress(0);
    setCurrentTime(0);
    setIsPlaying(false);
  }, [currentTrack]);

  if (hide) return null;

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.previewUrl) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }

  function onTouchStart(e) {
    const t = e.touches[0];
    const rect = btnRef.current?.getBoundingClientRect();
    dragData.current = {
      active: true, moved: false,
      sx: t.clientX, sy: t.clientY,
      bx: pos?.x ?? (window.innerWidth - (rect?.width || 56) - 16),
      by: pos?.y ?? (window.innerHeight - (rect?.height || 56) - 80),
    };
  }
  function onTouchMove(e) {
    if (!dragData.current.active) return;
    e.preventDefault();
    const t = e.touches[0];
    const dx = t.clientX - dragData.current.sx;
    const dy = t.clientY - dragData.current.sy;
    if (Math.hypot(dx, dy) > 8) {
      dragData.current.moved = true;
      const newX = Math.max(4, Math.min(window.innerWidth - 60, dragData.current.bx + dx));
      const newY = Math.max(4, Math.min(window.innerHeight - 100, dragData.current.by + dy));
      setPos({ x: newX, y: newY });
    }
  }
  function onTouchEnd() {
    if (!dragData.current.moved) setIsOpen(true);
    dragData.current.active = false;
    dragData.current.moved = false;
  }

  const R = 23;
  const C = 2 * Math.PI * R;
  const dashOff = C * (1 - progress);

  const btnStyle = pos
    ? { position: "fixed", left: `${pos.x}px`, top: `${pos.y}px`, bottom: "auto", right: "auto", zIndex: 290 }
    : { position: "fixed", right: "16px", bottom: "76px", zIndex: 290 };

  return (
    <>
      <audio ref={audioRef} preload="metadata" />

      {/* Floating Button */}
      <div
        ref={btnRef}
        style={btnStyle}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center justify-center rounded-full select-none"
          style={{ width: 54, height: 54, background: "rgba(8,10,15,0.92)", boxShadow: "0 6px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,158,11,0.2)" }}
          aria-label="Music Player"
        >
          <svg className="absolute inset-0" width="54" height="54" viewBox="0 0 54 54" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="27" cy="27" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
            <circle cx="27" cy="27" r={R} fill="none" stroke={isPlaying ? "#f59e0b" : "rgba(245,158,11,0.4)"} strokeWidth="3" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={dashOff} style={{ transition: "stroke-dashoffset 0.25s linear" }} />
          </svg>
          {currentTrack?.artworkUrl100 ? (
            <img src={currentTrack.artworkUrl100} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
          )}
          {isPlaying && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full flex items-center justify-center" style={{ background: "#f59e0b" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </span>
          )}
        </button>
      </div>

      {/* Player Panel */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[400] flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
        >
          <div
            className="w-full max-w-sm mx-4 mb-20 rounded-3xl overflow-hidden"
            style={{ background: "#0d0f17", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 -20px 60px rgba(0,0,0,0.5)" }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
            </div>

            {currentTrack ? (
              <div className="px-5 pt-3 pb-5 flex flex-col items-center">
                <img
                  src={(currentTrack.artworkUrl100 || "").replace("100x100", "400x400")}
                  alt={currentTrack.trackName || ""}
                  className="w-28 h-28 rounded-2xl object-cover shadow-2xl mb-4"
                  style={{ border: "1px solid rgba(245,158,11,0.2)" }}
                />
                <p className="text-sm font-bold text-white text-center line-clamp-1 w-full mb-0.5">{currentTrack.trackName || "Unknown Track"}</p>
                <p className="text-xs text-gray-400 mb-4 line-clamp-1">{currentTrack.artistName || "Unknown Artist"}</p>

                <div className="w-full mb-1">
                  <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="h-full rounded-full" style={{ width: `${progress * 100}%`, background: "linear-gradient(to right,#f59e0b,#ef4444)", transition: "width 0.25s linear" }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px]" style={{ color: "#6b7280" }}>{formatTime(currentTime)}</span>
                    <span className="text-[10px]" style={{ color: "#6b7280" }}>{formatTime(duration || (currentTrack.trackTimeMillis || 0) / 1000)}</span>
                  </div>
                </div>

                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full flex items-center justify-center mt-2 transition-transform active:scale-95"
                  style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)", boxShadow: "0 4px 20px rgba(245,158,11,0.4)" }}
                >
                  {isPlaying ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
                  )}
                </button>
              </div>
            ) : (
              <div className="px-5 py-8 text-center">
                <svg className="mx-auto mb-3" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                </svg>
                <p className="text-sm text-gray-500">{searching ? "Mencari lagu..." : "Tidak ada lagu"}</p>
              </div>
            )}

            <div className="px-4 pb-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <form onSubmit={(e) => { e.preventDefault(); doSearch(searchInput || "Inni uhibbuka"); }} className="flex gap-2 mt-3">
                <div className="relative flex-1">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Cari lagu..."
                    className="w-full text-sm pl-8 pr-3 py-2 rounded-xl outline-none text-gray-300 placeholder-gray-600"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={searching}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-white transition-opacity disabled:opacity-50 flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)" }}
                >
                  {searching ? "..." : "Cari"}
                </button>
              </form>
            </div>

            {tracks.length > 0 && (
              <div className="px-4 pb-3 space-y-0.5 max-h-44 overflow-y-auto hide-scrollbar">
                <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "#4b5563" }}>Hasil</p>
                {tracks.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrentTrack(t); setIsPlaying(false); }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl transition-all text-left"
                    style={{ background: currentTrack === t ? "rgba(245,158,11,0.1)" : "transparent", border: currentTrack === t ? "1px solid rgba(245,158,11,0.2)" : "1px solid transparent" }}
                  >
                    <img src={t.artworkUrl100} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white line-clamp-1">{t.trackName}</p>
                      <p className="text-[10px]" style={{ color: "#6b7280" }}>{t.artistName}</p>
                    </div>
                    {currentTrack === t && isPlaying && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" className="flex-shrink-0 animate-pulse">
                        <rect x="3" y="9" width="3" height="12" rx="1"/><rect x="9" y="5" width="3" height="16" rx="1"/><rect x="15" y="7" width="3" height="14" rx="1"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}

            <button onClick={() => setIsOpen(false)} className="w-full py-3 text-xs text-center transition-colors hover:text-white" style={{ color: "#4b5563", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}
