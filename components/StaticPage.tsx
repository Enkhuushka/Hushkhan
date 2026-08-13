"use client";

import { useEffect, useRef } from "react";
import { useCart } from "./CartProvider";

interface StaticPageProps {
  html: string;
}

export function StaticPage({ html }: StaticPageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { addToCart, upsellAdd } = useCart();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest("[data-id]");
      if (btn) {
        const id = btn.getAttribute("data-id");
        const title = btn.getAttribute("data-title") || "";
        const image = btn.getAttribute("data-image") || "";
        const price = parseInt(btn.getAttribute("data-price") || "0", 10);
        const original = parseInt(btn.getAttribute("data-original") || "0", 10);
        if (id) addToCart(id, "Багцад авах", price, original, title, image);
        return;
      }
      const upsell = target.closest("[data-upsell]");
      if (upsell) {
        const key = upsell.getAttribute("data-upsell");
        if (key) upsellAdd(key);
      }
    };

    el.addEventListener("click", handleClick);
    return () => el.removeEventListener("click", handleClick);
  }, [addToCart, upsellAdd]);

  useEffect(() => {
    const selectors = [".reveal", ".reveal-left", ".reveal-right", ".reveal-scale"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    selectors.forEach((sel) => {
      ref.current?.querySelectorAll(sel).forEach((node) => observer.observe(node));
    });

    ref.current?.querySelectorAll("section").forEach((section) => {
      if (section.classList.contains("no-reveal")) return;
      const hasReveal = selectors.some((sel) =>
        section.classList.contains(sel.replace(".", ""))
      );
      if (!hasReveal) {
        section.classList.add("auto-reveal");
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [html]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}
