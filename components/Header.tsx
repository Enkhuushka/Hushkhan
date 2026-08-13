"use client";

import { useEffect, useState } from "react";
import { useCartCount } from "@/hooks/useCartCount";

const nav = [
  { label: "Бүтээгдэхүүн", href: "/shop" },
  { label: "Бидний тухай", href: "/about" },
  { label: "Тогтвортой хөгжил", href: "/sustainability" },
  { label: "Хамтын ажиллагаа", href: "/partnership" },
  { label: "Чанарын баталгаа", href: "/certificates" },
  { label: "Мэдээ", href: "/news" },
  { label: "Ажлын байр", href: "/careers" },
];

const langs = ["MN", "EN", "中文", "RU", "KR"];

export function Header() {
  const count = useCartCount();
  const [isDark, setIsDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsDark(document.body.classList.contains("header-over-dark"));
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    const observer = new MutationObserver(check);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => {
      window.removeEventListener("scroll", check);
      observer.disconnect();
    };
  }, []);

  const triggerStatic = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.click();
  };

  return (
    <>
      <header
        className={[
          "fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2",
          "rounded-3xl border px-4 lg:px-6 h-14 lg:h-16",
          "flex items-center justify-between",
          "transition-colors duration-300",
          isDark
            ? "bg-black/25 border-white/10 text-[#f5f1ea] shadow-2xl shadow-black/30"
            : "bg-white/80 border-black/5 text-[#1e1e1e] shadow-lg shadow-black/5 backdrop-blur-xl",
        ].join(" ")}
      >
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <svg
            className="h-7 w-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2c-3.5 4-5.5 8-5.5 12a5.5 5.5 0 0 0 11 0C17.5 10 15.5 6 12 2Z" />
            <path d="M12 6v12" />
            <path d="M8.5 10h7" />
            <path d="M8 14h8" />
            <path d="M9 18h6" />
          </svg>
          <span className="text-lg lg:text-xl font-semibold tracking-tight">HushKhan</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden xl:flex items-center justify-center gap-8 absolute left-1/2 -translate-x-1/2">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative block h-5 overflow-hidden text-[11px] font-bold uppercase tracking-wider"
            >
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                {item.label}
              </span>
              <span className="absolute left-0 top-0 block translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-[#c9a24f]">
                {item.label}
              </span>
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          <div
            className={[
              "hidden md:flex items-center rounded-full px-1 py-1 text-[10px] font-semibold",
              isDark ? "bg-white/10" : "bg-black/5",
            ].join(" ")}
          >
            {langs.map((lang, i) => (
              <a
                key={lang}
                href={i === 0 ? "/" : "#"}
                className={[
                  "px-2 py-1 rounded-full transition-colors",
                  i === 0
                    ? isDark
                      ? "bg-white text-black"
                      : "bg-[#1e1e1e] text-white"
                    : "opacity-70 hover:opacity-100",
                ].join(" ")}
              >
                {lang}
              </a>
            ))}
          </div>

          <button
            onClick={() => triggerStatic("cartToggle")}
            className="relative flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-black/5"
            aria-label="Сагс"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#c9a24f] text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              triggerStatic("menuBtn");
              setMobileOpen((v) => !v);
            }}
            className="xl:hidden flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-black/5"
            aria-label="Цэс"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 5h16M4 12h16M4 19h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile menu placeholder so the static mobile menu has room when opened */}
      {mobileOpen && <div className="xl:hidden" />}
    </>
  );
}
