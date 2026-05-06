"use client";

import { useEffect, useState } from "react";
import { Languages, X, ChevronDown, Zap } from "lucide-react";

const LANGUAGES = [
  { code: "id", name: "🇮🇩 Bahasa Indonesia" },
  { code: "en", name: "🇬🇧 English" },
  { code: "ja", name: "🇯🇵 日本語" },
  { code: "zh-CN", name: "🇨🇳 简体中文" },
  { code: "zh-TW", name: "🇹🇼 繁體中文" },
  { code: "ko", name: "🇰🇷 한국어" },
  { code: "es", name: "🇪🇸 Español" },
  { code: "fr", name: "🇫🇷 Français" },
  { code: "de", name: "🇩🇪 Deutsch" },
  { code: "it", name: "🇮🇹 Italiano" },
  { code: "pt", name: "🇵🇹 Português" },
  { code: "ru", name: "🇷🇺 Русский" },
  { code: "ar", name: "🇸🇦 العربية" },
  { code: "th", name: "🇹🇭 ไทย" },
  { code: "vi", name: "🇻🇳 Tiếng Việt" },
];

export default function TranslateButtonV2() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLang, setSelectedLang] = useState("id");
  const [isTranslating, setIsTranslating] = useState(false);

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
      } catch (e) {
        console.error("Google Translate error:", e);
      }
    };

    // Load Google Translate script
    if (!document.querySelector("#google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const handleLanguageSelect = (langCode) => {
    setSelectedLang(langCode);
    setShowDropdown(false);
  };

  const handleTranslate = () => {
    setIsTranslating(true);
    
    // Trigger Google Translate
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = selectedLang;
      select.dispatchEvent(new Event("change"));
    }

    // Simulate translation process
    setTimeout(() => {
      setIsTranslating(false);
      // Optional: Close panel after translation
      // setIsOpen(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button - HIGHEST Z-INDEX */}
      <div
        style={{
          position: "fixed",
          bottom: "100px",
          right: "20px",
          zIndex: 9999999,
          pointerEvents: "auto",
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#4f46e5",
            color: "white",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(79, 70, 229, 0.6)",
            transition: "all 0.3s ease",
            fontSize: "24px",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#4338ca";
            e.target.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#4f46e5";
            e.target.style.transform = "scale(1)";
          }}
          onTouchStart={(e) => {
            e.target.style.backgroundColor = "#4338ca";
            e.target.style.transform = "scale(1.1)";
          }}
          onTouchEnd={(e) => {
            e.target.style.backgroundColor = "#4f46e5";
            e.target.style.transform = "scale(1)";
          }}
        >
          {isOpen ? <X size={32} /> : <Languages size={32} />}
        </button>
      </div>

      {/* Panel - ALSO HIGH Z-INDEX */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "180px",
            right: "20px",
            zIndex: 9999998,
            pointerEvents: "auto",
            width: "320px",
            backgroundColor: "#1a1d2e",
            border: "2px solid #4f46e5",
            borderRadius: "16px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.8)",
            animation: "slideUp 0.3s ease",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              padding: "16px",
              borderRadius: "14px 14px 0 0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Languages size={20} color="white" />
              <h3 style={{ margin: 0, color: "white", fontSize: "16px", fontWeight: "bold" }}>
                Terjemahkan Halaman
              </h3>
            </div>
            <p style={{ margin: 0, color: "#e0e7ff", fontSize: "12px" }}>
              Pilih bahasa dan klik tombol terjemahan
            </p>
          </div>

          {/* Content */}
          <div style={{ padding: "16px", pointerEvents: "auto" }}>
            {/* Language Selector */}
            <div style={{ position: "relative", marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#9ca3af", marginBottom: "8px", fontWeight: "500" }}>
                Pilih Bahasa Target:
              </label>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#252a3f",
                  border: "1px solid #4f46e5",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#7c3aed";
                  e.target.style.backgroundColor = "#2a2f45";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "#4f46e5";
                  e.target.style.backgroundColor = "#252a3f";
                }}
              >
                <span>
                  {LANGUAGES.find((l) => l.code === selectedLang)?.name || "Pilih Bahasa"}
                </span>
                <ChevronDown
                  size={18}
                  style={{
                    transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    marginTop: "8px",
                    backgroundColor: "#252a3f",
                    border: "1px solid #4f46e5",
                    borderRadius: "8px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
                    maxHeight: "200px",
                    overflowY: "auto",
                    zIndex: 10000000,
                    pointerEvents: "auto",
                  }}
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "14px",
                        border: "none",
                        backgroundColor:
                          selectedLang === lang.code ? "#4f46e5" : "transparent",
                        color: selectedLang === lang.code ? "white" : "#d1d5db",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        borderLeft:
                          selectedLang === lang.code ? "3px solid #7c3aed" : "3px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedLang !== lang.code) {
                          e.target.style.backgroundColor = "#2a2f45";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedLang !== lang.code) {
                          e.target.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Translate Button */}
            <button
              onClick={handleTranslate}
              disabled={isTranslating}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: isTranslating ? "#6b7280" : "#4f46e5",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: isTranslating ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.3s ease",
                boxShadow: isTranslating ? "none" : "0 4px 12px rgba(79, 70, 229, 0.4)",
                opacity: isTranslating ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isTranslating) {
                  e.target.style.backgroundColor = "#7c3aed";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 16px rgba(124, 58, 237, 0.5)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isTranslating) {
                  e.target.style.backgroundColor = "#4f46e5";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 12px rgba(79, 70, 229, 0.4)";
                }
              }}
            >
              <Zap size={18} />
              {isTranslating ? "Sedang Menerjemahkan..." : "Terjemahkan Sekarang"}
            </button>

            {/* Info */}
            <div
              style={{
                marginTop: "12px",
                padding: "12px",
                backgroundColor: "#4f46e5",
                borderRadius: "8px",
                fontSize: "11px",
                color: "#e0e7ff",
                lineHeight: "1.5",
              }}
            >
              ⚡ Klik tombol di atas untuk mulai menerjemahkan halaman ke bahasa pilihan Anda.
            </div>
          </div>
        </div>
      )}

      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" style={{ display: "none" }} />

      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }

        body {
          top: 0px !important;
        }

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
      `}</style>
    </>
  );
}
