export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Hero skeleton */}
      <div className="w-full h-80 rounded-2xl mb-6 animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />

      {/* Grid skeleton */}
      <div className="manga-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="rounded-xl mb-2 animate-pulse" style={{ aspectRatio: "2/3", background: "rgba(255,255,255,0.05)" }} />
            <div className="h-3 rounded w-3/4 mb-1" style={{ background: "rgba(255,255,255,0.05)" }} />
            <div className="h-3 rounded w-1/2" style={{ background: "rgba(255,255,255,0.05)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
