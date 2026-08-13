"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";

const navItems = [
  { href: "/shop", label: "Бүтээгдэхүүн" },
  { href: "/about", label: "Бидний тухай" },
  { href: "/sustainability", label: "Тогтвортой хөгжил" },
  { href: "/partnership", label: "Хамтын ажиллагаа" },
  { href: "/certificates.html", label: "Чанарын баталгаа" },
  { href: "/news", label: "Мэдээ" },
  { href: "/careers", label: "Ажлын байр" },
];

const langs = [
  { code: "MN", href: "/" },
  { code: "EN", href: "#" },
  { code: "中文", href: "#" },
  { code: "RU", href: "#" },
  { code: "KR", href: "#" },
];

function RollLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} data-text={label} className="roll-link">
      <span>{label}</span>
    </Link>
  );
}

export function Header() {
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("header-over-dark", !scrolled);
  }, [scrolled]);

  return (
    <>
      <header className={`header ${scrolled ? "header-scrolled" : ""}`}>
        <div className="header-inner">
          <Link href="/" className="logo">
            <svg className="logo-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2c-3.5 4-5.5 8-5.5 12a5.5 5.5 0 0 0 11 0C17.5 10 15.5 6 12 2Z" />
              <path d="M12 6v12" />
              <path d="M8.5 10h7" />
              <path d="M8 14h8" />
              <path d="M9 18h6" />
            </svg>
            HushKhan
          </Link>
          <nav>
            <ul className="nav-links">
              {navItems.map((item) => (
                <li key={item.href}>
                  <RollLink href={item.href} label={item.label} />
                </li>
              ))}
            </ul>
          </nav>
          <div className="header-right">
            <div className="lang-bar">
              {langs.map((lang, idx) => (
                <a key={lang.code} href={lang.href} className={idx === 0 ? "active" : ""}>
                  {lang.code}
                </a>
              ))}
            </div>
            <button className="icon-btn cart-toggle" onClick={openCart} aria-label="Cart">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <span className="cart-count">{count}</span>
            </button>
            <button
              className="icon-btn menu-btn"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 5h16" />
                  <path d="M4 12h16" />
                  <path d="M4 19h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? "active" : ""}`} id="mobileMenu">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
            {item.label}
          </Link>
        ))}
        <Link href="/careers/contact" onClick={() => setMenuOpen(false)}>
          Холбоо барих
        </Link>
      </div>
    </>
  );
}
