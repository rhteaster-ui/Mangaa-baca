"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const tech = [
  {
    name: "Next.js 15",
    desc: "React framework · App Router · SSR + ISR",
    category: "Framework",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.499-.054z"/>
      </svg>
    ),
  },
  {
    name: "React 19",
    desc: "UI library · Concurrent rendering",
    category: "Library",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="12" cy="12" rx="10" ry="4.5"/>
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)"/>
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)"/>
        <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    name: "Tailwind CSS v3",
    desc: "Utility-first CSS · Mobile-first design",
    category: "Styling",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
      </svg>
    ),
  },
  {
    name: "MangaDex API",
    desc: "Manga data · 50k+ titles · Official REST API",
    category: "Data Source",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        <line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/>
      </svg>
    ),
  },
  {
    name: "Vercel",
    desc: "Edge network · Serverless functions · CDN global",
    category: "Hosting",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 22.525H0l12-21.05 12 21.05z"/>
      </svg>
    ),
  },
  {
    name: "Tesseract.js",
    desc: "OCR browser · Manga text extraction",
    category: "Feature",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M7 8h10M12 8v8M8 16h8"/>
      </svg>
    ),
  },
];

const socials = [
  {
    href: "https://whatsapp.com/channel/0029VbBjyjlJ93wa6hwSWa0p",
    label: "WhatsApp Channel",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    href: "https://t.me/rAi_engine",
    label: "Telegram",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },
  {
    href: "https://www.tiktok.com/@r_hmtofc",
    label: "TikTok",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z"/>
      </svg>
    ),
  },
  {
    href: "https://github.com/rahmat-369",
    label: "GitHub",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/rahmt_nhw",
    label: "Instagram",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
];

export default function AboutPage() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") setInstalled(true);
    setDeferredPrompt(null);
  }

  return (
    <div className="min-h-screen" style={{ background: "#080a0f" }}>
      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">

        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Kembali
        </Link>

        {/* === APP HERO CARD === */}
        <div className="rounded-3xl overflow-hidden" style={{ background: "#0d1018", border: "1px solid rgba(245,158,11,0.12)" }}>
          {/* Banner Image */}
          <div className="relative" style={{ height: "160px" }}>
            <img
              src="/banner.png"
              alt="MangaRift Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(13,16,24,0.85) 100%)" }} />

            {/* Favicon overlapping banner bottom edge */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10">
              <div
                className="w-20 h-20 rounded-2xl overflow-hidden"
                style={{ border: "3px solid #0d1018", boxShadow: "0 8px 32px rgba(245,158,11,0.3)", background: "#080a0f" }}
              >
                <img src="/favicon.png" alt="MangaRift" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="pt-14 pb-6 px-5 text-center flex flex-col items-center">
            <h1
              className="text-2xl font-bold mb-1"
              style={{ background: "linear-gradient(135deg,#f59e0b,#fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              MangaRift
            </h1>
            <p className="text-xs mb-1" style={{ color: "#6b7280" }}>v1.0.0 · Platform Baca Manga, Manhua &amp; Manhwa</p>
            <p className="text-sm leading-relaxed mb-5 max-w-xs" style={{ color: "#9ca3af" }}>
              Baca manga, manhwa &amp; manhua terbaru gratis. Koleksi lengkap dari seluruh dunia, update setiap hari.
            </p>

            {/* Install Button */}
            <button
              onClick={handleInstall}
              disabled={installed || !deferredPrompt}
              className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all active:scale-95 disabled:opacity-60"
              style={{
                background: installed ? "rgba(34,197,94,0.15)" : "linear-gradient(135deg,#f59e0b,#ef4444)",
                color: installed ? "#22c55e" : "white",
                border: installed ? "1px solid rgba(34,197,94,0.3)" : "none",
              }}
            >
              {installed ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5"/></svg>
                  Sudah Terinstall
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Add to Home Screen
                </>
              )}
            </button>
            {!deferredPrompt && !installed && (
              <p className="text-[11px] mt-2" style={{ color: "#4b5563" }}>
                Buka menu browser → &quot;Add to Home Screen&quot; untuk install
              </p>
            )}
          </div>
        </div>

        {/* === TECH STACK === */}
        <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h2 className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#f59e0b" }}>
            Tech Stack &amp; Framework
          </h2>
          <div className="space-y-2">
            {tech.map((t) => (
              <div
                key={t.name}
                className="flex items-center gap-3 rounded-xl p-3 transition-all"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: "rgba(245,158,11,0.08)", color: "#f59e0b" }}>
                  {t.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>{t.category}</span>
                  </div>
                  <p className="text-[11px] mt-0.5" style={{ color: "#6b7280" }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === ABOUT PROJECT === */}
        <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h2 className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#f59e0b" }}>
            Tentang Project
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
            <span className="text-white font-medium">MangaRift</span> adalah platform baca manga berbasis web yang memanfaatkan{" "}
            <span style={{ color: "#f59e0b" }}>MangaDex API</span> — database manga terbesar dengan 50.000+ judul dari seluruh dunia.
            Dirancang mobile-first dengan fokus pada kecepatan, kemudahan navigasi, dan pengalaman baca yang nyaman.
          </p>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { num: "50K+", label: "Judul" },
              { num: "Gratis", label: "Selamanya" },
              { num: "PWA", label: "Installable" },
            ].map(({ num, label }) => (
              <div key={label} className="rounded-xl p-3 text-center" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.1)" }}>
                <p className="text-base font-bold" style={{ color: "#f59e0b" }}>{num}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "#6b7280" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* === DISCLAIMER === */}
        <div className="rounded-2xl p-4" style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)" }}>
          <h2 className="text-[11px] font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: "#ef4444" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Disclaimer
          </h2>
          <p className="text-xs leading-relaxed" style={{ color: "#9ca3af" }}>
            MangaRift tidak menyimpan konten manga di server kami. Semua data bersumber langsung dari MangaDex. Dibuat untuk tujuan edukasi &amp; pengembangan skill.
          </p>
        </div>

        {/* === DEVELOPER CARD === */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(245,158,11,0.1)" }}>
          <div className="p-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-lg"
              style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)", color: "#080a0f", border: "1px solid rgba(245,158,11,0.3)" }}
            >
              R
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-white">R_hmt ofc</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(245,158,11,0.13)", color: "#f59e0b" }}>Owner</span>
              </div>
              <p className="text-[11px] mt-0.5" style={{ color: "#6b7280" }}>Lead Developer &amp; UI/UX Designer</p>
            </div>
          </div>

          <div className="p-4">
            <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "#4b5563" }}>Hubungi &amp; Ikuti</p>
            <div className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-xl transition-all hover:text-white"
                  style={{ color: "#9ca3af", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {s.icon}
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-[11px]" style={{ color: "#374151" }}>© 2026 R_hmt ofc · MangaRift · Built with Next.js &amp; Vercel</p>
        </div>
      </div>
    </div>
  );
}
