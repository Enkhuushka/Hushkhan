"use client";

import { useEffect, useState } from "react";
import { useCartCount } from "@/hooks/useCartCount";

const nav = [
  { label: "Бидний тухай", href: "/about" },
  { label: "Тогтвортой хөгжил", href: "/sustainability" },
  { label: "Үйлдвэрлэл", href: "/partnership/production" },
  { label: "Бүтээгдэхүүн", href: "/shop" },
  { label: "Мэдээ", href: "/news" },
  { label: "Холбоо барих", href: "/careers/contact" },
];

const langs = ["MN", "EN", "中文", "RU", "KR"];

export function Header() {
  const count = useCartCount();
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsDark(document.body.classList.contains("header-over-dark"));
      setScrolled(window.scrollY > 10);
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

  const dark = isDark && !scrolled;

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "border-b h-[72px]",
        dark
          ? "bg-transparent border-white/15 text-[#fff8ed]"
          : "bg-[#fff8ed]/92 border-[rgba(43,28,22,0.12)] text-[#2b1c16] backdrop-blur-md",
      ].join(" ")}
    >
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
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
          <span>HushKhan</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden xl:flex items-center gap-8">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative text-sm font-medium transition-colors hover:text-[#c9a24f] py-1 group"
            >
              {item.label}
              <span className="absolute left-0 bottom-[-2px] h-[1.5px] w-0 bg-[#c9a24f] transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <div className={["hidden md:flex items-center gap-3 text-sm font-medium", dark ? "text-[#fff8ed]/80" : "text-[#2b1c16]/70"].join(" ")}>
            {langs.map((lang, i) => (
              <a
                key={lang}
                href={i === 0 ? "/" : "#"}
                className={[
                  "transition-opacity hover:opacity-100",
                  i === 0 ? "opacity-100" : "opacity-60",
                ].join(" ")}
              >
                {lang}
              </a>
            ))}
          </div>

          <button
            onClick={() => triggerStatic("cartToggle")}
            className="relative flex items-center justify-center transition-colors hover:text-[#c9a24f]"
            aria-label="Сагс"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c9a24f] px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </button>

          <button
            onClick={() => triggerStatic("menuBtn")}
            className="xl:hidden flex items-center justify-center transition-colors hover:text-[#c9a24f]"
            aria-label="Цэс"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 5h16M4 12h16M4 19h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
