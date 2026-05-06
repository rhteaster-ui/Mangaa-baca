import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 px-4 text-center">
      <p className="text-6xl">📚</p>
      <h1 className="text-2xl font-bold text-white">Halaman Tidak Ditemukan</h1>
      <p className="text-sm text-gray-400">Manga atau halaman yang kamu cari tidak ada.</p>
      <Link
        href="/"
        className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white"
        style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)" }}
      >
        ← Kembali ke Home
      </Link>
    </div>
  );
}
