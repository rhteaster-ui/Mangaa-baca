"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";

// ── helpers ─────────────────────────────────────────────────────────────────

/** Translate a single string via our free API */
async function translateText(text, targetLang) {
  if (!text.trim()) return "";
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, targetLang }),
  });
  const data = await res.json();
  return data.translated || text;
}

/**
 * Sample the dominant background colour around a bounding-box edge.
 * Returns an rgb string like "rgb(255,255,255)".
 */
function sampleBgColor(ctx, bbox, imgW, imgH) {
  const samples = [];
  const { x0, y0, x1, y1 } = bbox;
  const margin = 4;
  const px = (x, y) => {
    const [r, g, b] = ctx.getImageData(
      Math.max(0, Math.min(imgW - 1, x)),
      Math.max(0, Math.min(imgH - 1, y)),
      1, 1
    ).data;
    return [r, g, b];
  };

  // corners + mid-edge samples
  for (let i = 0; i <= 4; i++) {
    const t = i / 4;
    const mx = x0 + (x1 - x0) * t;
    const my = y0 + (y1 - y0) * t;
    samples.push(px(x0 - margin, my));
    samples.push(px(x1 + margin, my));
    samples.push(px(mx, y0 - margin));
    samples.push(px(mx, y1 + margin));
  }

  const avg = samples.reduce(
    (acc, [r, g, b]) => [acc[0] + r, acc[1] + g, acc[2] + b],
    [0, 0, 0]
  ).map((v) => Math.round(v / samples.length));

  // Snap to white or black for clean manga look
  const lum = 0.299 * avg[0] + 0.587 * avg[1] + 0.114 * avg[2];
  return lum > 128 ? "#ffffff" : "#1a1a1a";
}

/**
 * Draw text inside a box, auto-sizing font to fit.
 * Returns the font size used.
 */
function drawFittedText(ctx, text, bbox, bgColor) {
  const { x0, y0, x1, y1 } = bbox;
  const bw = x1 - x0;
  const bh = y1 - y0;
  const pad = 4;

  const isDark = bgColor === "#1a1a1a";
  const textColor = isDark ? "#ffffff" : "#111111";

  // Fill background
  ctx.fillStyle = bgColor;
  // Slightly rounded rect using arcs
  const r = 4;
  ctx.beginPath();
  ctx.moveTo(x0 + r, y0);
  ctx.lineTo(x1 - r, y0);
  ctx.arcTo(x1, y0, x1, y0 + r, r);
  ctx.lineTo(x1, y1 - r);
  ctx.arcTo(x1, y1, x1 - r, y1, r);
  ctx.lineTo(x0 + r, y1);
  ctx.arcTo(x0, y1, x0, y1 - r, r);
  ctx.lineTo(x0, y0 + r);
  ctx.arcTo(x0, y0, x0 + r, y0, r);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = textColor;
  ctx.textBaseline = "top";

  // Binary search best font size
  let lo = 8, hi = Math.min(bh, 36), best = 8;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    ctx.font = `bold ${mid}px "Noto Sans", "Arial", sans-serif`;
    const lines = wrapText(ctx, text, bw - pad * 2);
    const totalH = lines.length * mid * 1.25;
    if (totalH <= bh - pad * 2) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  ctx.font = `bold ${best}px "Noto Sans", "Arial", sans-serif`;
  const lines = wrapText(ctx, text, bw - pad * 2);
  const lineH = best * 1.25;
  const totalH = lines.length * lineH;
  const startY = y0 + pad + (bh - pad * 2 - totalH) / 2;

  lines.forEach((line, i) => {
    const tw = ctx.measureText(line).width;
    const startX = x0 + pad + (bw - pad * 2 - tw) / 2;
    ctx.fillText(line, startX, startY + i * lineH);
  });

  return best;
}

/** Wrap text to fit maxWidth, returns array of lines */
function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let cur = "";

  for (const word of words) {
    const test = cur ? cur + " " + word : word;
    if (ctx.measureText(test).width <= maxWidth) {
      cur = test;
    } else {
      if (cur) lines.push(cur);
      // if single word is too wide, just use it anyway
      cur = word;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [text];
}

// ── Main component ──────────────────────────────────────────────────────────

export default function MangaTranslator({ imageUrl, targetLang, onDone, onError }) {
  const canvasRef = useRef(null);
  const [step, setStep] = useState("idle"); // idle | loading | ocr | translating | done | error
  const [progress, setProgress] = useState(0);
  const [errMsg, setErrMsg] = useState("");

  const proxyUrl = `/api/proxy/page?url=${encodeURIComponent(imageUrl)}`;

  const run = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    try {
      // ── Step 1: Load image ──────────────────────────────────────────────
      setStep("loading");
      const img = await new Promise((res, rej) => {
        const i = new Image();
        i.crossOrigin = "anonymous";
        i.onload = () => res(i);
        i.onerror = () => rej(new Error("Gagal load gambar"));
        i.src = proxyUrl;
      });

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      // ── Step 2: OCR with bounding boxes ────────────────────────────────
      setStep("ocr");
      setProgress(0);

      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const { data } = await worker.recognize(proxyUrl);
      await worker.terminate();

      // Collect paragraph-level blocks (better than word-level for bubbles)
      const blocks = [];
      for (const block of data.blocks || []) {
        for (const para of block.paragraphs || []) {
          const text = para.text?.trim();
          if (!text || text.length < 2) continue;
          // Skip noise: single chars, pure numbers/symbols
          if (/^[\d\W_]{1,3}$/.test(text)) continue;
          blocks.push({ text, bbox: para.bbox });
        }
      }

      if (blocks.length === 0) {
        setStep("done");
        toast("🖼️ Tidak ada teks di halaman ini", { duration: 2500 });
        onDone?.({ canvas, noText: true });
        return;
      }

      // ── Step 3: Translate all blocks ───────────────────────────────────
      setStep("translating");
      const results = [];

      for (let i = 0; i < blocks.length; i++) {
        const { text, bbox } = blocks[i];
        setProgress(Math.round((i / blocks.length) * 100));
        try {
          const translated = await translateText(text, targetLang);
          results.push({ translated, bbox });
        } catch {
          results.push({ translated: text, bbox });
        }
      }

      // ── Step 4: Draw overlays ───────────────────────────────────────────
      for (const { translated, bbox } of results) {
        if (!translated?.trim()) continue;
        const bgColor = sampleBgColor(ctx, bbox, canvas.width, canvas.height);
        drawFittedText(ctx, translated, bbox, bgColor);
      }

      setStep("done");
      toast.success(`✅ ${results.length} teks berhasil diterjemahkan!`, { duration: 3000 });
      onDone?.({ canvas, count: results.length });
    } catch (err) {
      console.error(err);
      setErrMsg(err.message);
      setStep("error");
      toast.error("❌ Terjemahan gagal: " + err.message, { duration: 4000 });
      onError?.(err.message);
    }
  }, [imageUrl, targetLang, proxyUrl, onDone, onError]);

  useEffect(() => {
    run();
  }, [run]);

  return (
    <div className="relative w-full">
      {/* Canvas — always rendered, shown when done */}
      <canvas
        ref={canvasRef}
        className="w-full h-auto block"
        style={{
          display: step === "done" ? "block" : "none",
          imageRendering: "auto",
        }}
      />

      {/* Loading states overlay */}
      {step !== "done" && step !== "error" && (
        <div
          className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center"
          style={{ background: "#0a0a0a", minHeight: 300 }}
        >
          {step === "loading" && (
            <>
              <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <p className="text-sm text-gray-400">Memuat gambar...</p>
            </>
          )}

          {step === "ocr" && (
            <>
              <div className="text-3xl">🔍</div>
              <p className="text-sm text-white font-medium">Mendeteksi teks manga...</p>
              <div className="w-48 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg,#f59e0b,#ef4444)",
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">{progress}% · Tesseract OCR</p>
            </>
          )}

          {step === "translating" && (
            <>
              <div className="text-3xl">🌐</div>
              <p className="text-sm text-white font-medium">Menerjemahkan teks...</p>
              <div className="w-48 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg,#10b981,#059669)",
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">{progress}% · Google Translate</p>
            </>
          )}
        </div>
      )}

      {/* Error */}
      {step === "error" && (
        <div
          className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center"
          style={{ background: "#0a0a0a", minHeight: 300 }}
        >
          <p className="text-2xl">⚠️</p>
          <p className="text-sm text-red-400">{errMsg}</p>
          <button
            onClick={run}
            className="text-xs px-4 py-2 rounded-xl text-white font-semibold"
            style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)" }}
          >
            Coba Lagi
          </button>
        </div>
      )}
    </div>
  );
}
