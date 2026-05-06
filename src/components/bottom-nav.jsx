"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "#f59e0b" : "none"} stroke={active ? "#f59e0b" : "#4b5563"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: "/search",
    label: "Jelajah",
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#f59e0b" : "#4b5563"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
    ),
  },
  {
    href: "/library",
    label: "Library",
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#f59e0b" : "#4b5563"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
      </svg>
    ),
  },
  {
    href: "/about",
    label: "About",
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#f59e0b" : "#4b5563"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M20 21a8 8 0 1 0-16 0"/>
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname?.includes("/chapter/")) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[200]"
      style={{ background: "rgba(8,10,15,0.97)", borderTop: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
    >
      <div className="flex justify-around items-center w-full max-w-lg mx-auto" style={{ height: "60px", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        {navItems.map(({ href, label, icon }) => {
          const isActive = pathname === href || (href === "/search" && pathname?.startsWith("/search"));
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all"
              style={{ color: isActive ? "#f59e0b" : "#4b5563", minWidth: "64px" }}
            >
              {icon(isActive)}
              <span className="text-[10px]">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
