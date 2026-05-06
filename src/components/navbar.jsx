"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const router = useRouter();
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  function handleSearch(e) {
    e.preventDefault();
    if (!searchVal.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchVal.trim())}`);
    setSearchVal("");
    setSearchOpen(false);
  }

  return (
    <header
      className="sticky top-0 z-[100]"
      style={{ background: "rgba(8,10,15,0.95)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-5xl mx-auto flex items-center gap-3 px-4 py-2.5" style={{ height: "56px" }}>
        {/* Brand — always visible */}
        <Link href="/" className="flex items-center gap-1.5 flex-shrink-0 mr-2">
          <img src="/icon.png" alt="MangaRift" className="w-8 h-8 object-contain rounded-lg" style={{ background: "#fff", padding: "1px" }} />
          <span
            className="text-[17px] font-bold tracking-tight"
            style={{ background: "linear-gradient(135deg,#f59e0b,#fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            angarift
          </span>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1 mr-2">
          {[
            { href: "/", label: "Home" },
            { href: "/search", label: "Jelajah" },
            { href: "/library", label: "Library" },
            { href: "/about", label: "About" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all">
              {label}
            </Link>
          ))}
        </nav>

        {/* Search area */}
        <div className="flex items-center gap-1.5">
          {searchOpen && (
            <form onSubmit={handleSearch} className="flex items-center gap-1.5">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input
                  ref={inputRef}
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Cari manga..."
                  className="text-sm text-gray-200 placeholder-gray-600 pl-9 pr-3 py-2 rounded-xl outline-none w-[180px] md:w-[240px] transition-all"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(245,158,11,0.35)" }}
                />
              </div>
            </form>
          )}

          {/* Toggle search icon */}
          <button
            onClick={() => {
              if (searchOpen && searchVal.trim()) {
                router.push(`/search?q=${encodeURIComponent(searchVal.trim())}`);
                setSearchVal("");
                setSearchOpen(false);
              } else {
                setSearchOpen((v) => !v);
                if (searchOpen) setSearchVal("");
              }
            }}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all flex-shrink-0"
            style={{ background: searchOpen ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.05)", border: searchOpen ? "1px solid rgba(245,158,11,0.35)" : "1px solid rgba(255,255,255,0.07)" }}
            aria-label={searchOpen ? "Cari" : "Buka pencarian"}
          >
            {searchOpen ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"><path d="M21 21l-4.35-4.35"/><circle cx="11" cy="11" r="8"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            )}
          </button>

          {searchOpen && (
            <button
              onClick={() => { setSearchOpen(false); setSearchVal(""); }}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-white transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
