"use client";

import { useEffect, useState } from "react";
import { Languages, X, ChevronDown } from "lucide-react";

const LANGUAGES = [
  { code: "id", name: "Bahasa Indonesia" },
  { code: "en", name: "English" },
  { code: "ja", name: "日本語 (Japanese)" },
  { code: "zh-CN", name: "简体中文 (Simplified Chinese)" },
  { code: "zh-TW", name: "繁體中文 (Traditional Chinese)" },
  { code: "ko", name: "한국어 (Korean)" },
  { code: "es", name: "Español (Spanish)" },
  { code: "fr", name: "Français (French)" },
  { code: "de", name: "Deutsch (German)" },
  { code: "it", name: "Italiano (Italian)" },
  { code: "pt", name: "Português (Portuguese)" },
  { code: "ru", name: "Русский (Russian)" },
  { code: "ar", name: "العربية (Arabic)" },
  { code: "th", name: "ไทย (Thai)" },
  { code: "vi", name: "Tiếng Việt (Vietnamese)" },
  { code: "hi", name: "हिन्दी (Hindi)" },
  { code: "tr", name: "Türkçe (Turkish)" },
  { code: "pl", name: "Polski (Polish)" },
];

export default function GoogleTranslateFixed() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedLang, setSelectedLang] = useState("id");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "auto",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
        setIsLoaded(true);
      } catch (e) {
        console.error("Google Translate initialization error:", e);
      }
    };

    // Load Google Translate script
    const loadGoogleTranslate = () => {
      if (document.querySelector("#google-translate-script")) return;
      
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onerror = () => console.error("Failed to load Google Translate");
      document.body.appendChild(script);
    };

    // Add small delay to ensure DOM is ready
    const timer = setTimeout(loadGoogleTranslate, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLanguageSelect = (langCode) => {
    setSelectedLang(langCode);
    setShowDropdown(false);
    
    // Trigger Google Translate
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-[100] w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-all active:scale-95"
        title="Terjemahkan Halaman"
        style={{ boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)" }}
      >
        {isOpen ? <X size={28} /> : <Languages size={28} />}
      </button>

      {/* Translate Container */}
      <div
        className={`fixed bottom-40 right-6 z-[100] bg-[#1a1d2e] border border-indigo-500/30 rounded-2xl shadow-2xl transition-all duration-300 origin-bottom-right overflow-hidden`}
        style={{
          width: "320px",
          transform: isOpen ? "scale(1) opacity-100" : "scale(0) opacity-0",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Languages size={18} />
            Terjemahkan Halaman
          </h3>
          <p className="text-[11px] text-indigo-100 mt-1">
            Pilih bahasa untuk menerjemahkan konten
          </p>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full px-3 py-2.5 bg-[#252a3f] border border-indigo-500/20 rounded-lg text-white text-sm font-medium flex items-center justify-between hover:border-indigo-500/40 transition-colors"
            >
              <span className="truncate">
                {LANGUAGES.find(l => l.code === selectedLang)?.name || "Pilih Bahasa"}
              </span>
              <ChevronDown size={16} className={`transition-transform ${showDropdown ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#252a3f] border border-indigo-500/20 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`w-full px-3 py-2.5 text-left text-sm transition-colors ${
                      selectedLang === lang.code
                        ? "bg-indigo-600/30 text-indigo-300 border-l-2 border-indigo-500"
                        : "text-gray-300 hover:bg-[#2a2f45]"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hidden Google Translate Element */}
          <div id="google_translate_element" className="hidden" />

          {/* Info Text */}
          <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-lg p-3">
            <p className="text-[10px] text-gray-400 leading-relaxed">
              💡 <strong>Tips:</strong> Terjemahan teks UI akan bekerja sempurna. Untuk teks dalam gambar manga, Anda mungkin perlu menggunakan aplikasi OCR terpisah.
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Hide Google Translate default UI */
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }
        body {
          top: 0px !important;
        }

        /* Style Google Translate Select */
        .goog-te-gadget-simple {
          background-color: transparent !important;
          border: none !important;
          padding: 0 !important;
          display: none !important;
        }

        .goog-te-gadget-simple img {
          display: none !important;
        }

        .goog-te-combo {
          display: none !important;
        }

        .goog-te-gadget span {
          display: none !important;
        }

        .goog-te-gadget {
          color: transparent !important;
          font-size: 0 !important;
        }

        /* Prevent layout shift */
        .goog-te-banner-frame {
          display: none !important;
        }

        /* Smooth translation */
        body {
          transition: opacity 0.3s ease;
        }
      `}</style>
    </>
  );
}
