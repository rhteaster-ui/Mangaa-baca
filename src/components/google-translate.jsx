"use client";

import { useEffect, useState } from "react";
import { Languages, X } from "lucide-react";

export default function GoogleTranslate() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Function to initialize Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "auto",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
      setIsLoaded(true);
    };

    // Add Google Translate script
    const addScript = () => {
      if (document.querySelector("#google-translate-script")) return;
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    addScript();
  }, []);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-[100] w-12 h-12 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-all active:scale-95"
        title="Terjemahkan Halaman"
      >
        {isOpen ? <X size={24} /> : <Languages size={24} />}
      </button>

      {/* Translate Container */}
      <div
        className={`fixed bottom-40 right-6 z-[100] p-4 bg-[#12141c] border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 origin-bottom-right ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
        style={{ width: "280px" }}
      >
        <div className="mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Languages size={16} className="text-indigo-400" />
            Terjemahkan Halaman
          </h3>
          <p className="text-[10px] text-gray-400 mt-1">
            Gunakan Google Translate untuk menerjemahkan teks di halaman ini.
          </p>
        </div>
        
        <div id="google_translate_element" className="min-h-[40px] flex items-center justify-center bg-black/20 rounded-lg overflow-hidden">
          {!isLoaded && <div className="text-[10px] text-gray-500 animate-pulse">Memuat Google Translate...</div>}
        </div>

        <div className="mt-3 pt-3 border-t border-white/5">
          <p className="text-[9px] text-gray-500 italic">
            *Catatan: Terjemahan gambar (manga) mungkin tidak sempurna karena keterbatasan teknologi OCR browser.
          </p>
        </div>
      </div>

      <style jsx global>{`
        /* Hide Google Translate Top Bar */
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }
        body {
          top: 0px !important;
        }
        /* Style the Google Translate Select */
        .goog-te-gadget-simple {
          background-color: transparent !important;
          border: none !important;
          padding: 8px !important;
          border-radius: 8px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 100% !important;
          cursor: pointer !important;
        }
        .goog-te-gadget-simple img {
          display: none !important;
        }
        .goog-te-gadget-simple span {
          color: #e5e7eb !important;
          font-size: 13px !important;
          font-weight: 500 !important;
        }
        .goog-te-menu-value span {
          color: #e5e7eb !important;
        }
        .goog-te-menu-value:before {
          content: "Pilih Bahasa: " !important;
          color: #9ca3af !important;
          font-size: 11px !important;
          margin-right: 4px !important;
        }
        /* Hide "Powered by Google" */
        .goog-te-gadget span {
          display: none !important;
        }
        .goog-te-gadget {
          color: transparent !important;
          font-size: 0 !important;
        }
      `}</style>
    </>
  );
}
