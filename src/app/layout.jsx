import "./globals.css";
import Navbar from "@/components/navbar";
import BottomNav from "@/components/bottom-nav";
import MusicPlayer from "@/components/music-player";
import { Toaster } from "sonner";

export const metadata = {
  title: "MangaRift — Baca Manga, Manhua & Manhwa",
  description: "Platform baca manga, manhua, dan manhwa gratis dengan koleksi terlengkap. Update setiap hari. By R_hmt.",
  manifest: "/manifest.json",
  openGraph: {
    title: "MangaRift — Baca Manga, Manhua & Manhwa Gratis",
    description: "Baca manga, manhua, dan manhwa terbaru gratis. Koleksi lengkap, cepat & ringan.",
    images: [{ url: "/banner.png", width: 1500, height: 500, alt: "MangaRift Banner" }],
    type: "website",
    siteName: "MangaRift",
  },
  twitter: {
    card: "summary_large_image",
    title: "MangaRift — Baca Manga Gratis",
    description: "Platform baca manga, manhua, dan manhwa gratis terlengkap.",
    images: ["/banner.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#f59e0b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MangaRift" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="pb-24">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <BottomNav />
        <MusicPlayer />
        <Toaster position="top-center" toastOptions={{ style: { background: "#141720", color: "#e5e7eb", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "13px" } }} />
      </body>
    </html>
  );
}
