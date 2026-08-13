"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function closestYear(el: Element): string | null {
  const wrap = el.closest<HTMLElement>(".cert-year-wrap");
  const btn = wrap?.querySelector<HTMLElement>(".cert-year") || el.closest<HTMLElement>(".cert-year");
  if (!btn) return null;
  if (btn.dataset.year) return btn.dataset.year;
  const wrapData = wrap?.dataset.year;
  if (wrapData) return wrapData;
  const yearNum = btn.querySelector<HTMLElement>(".year-num")?.textContent;
  if (yearNum) return yearNum.trim();
  const aria = btn.getAttribute("aria-label");
  if (aria) return aria.trim();
  return btn.textContent?.trim() || null;
}

export default function CertificatesClient() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const cleanup: (() => void)[] = [];

    const timeline = document.querySelector<HTMLElement>(".cert-timeline-items");
    const carousel = document.querySelector<HTMLElement>(".cert-carousel");
    const track = document.querySelector<HTMLElement>(".cert-carousel-track");

    if (!timeline || !carousel || !track) return;

    const yearButtons = Array.from(timeline.querySelectorAll<HTMLElement>(".cert-year"));
    const slideEls = Array.from(document.querySelectorAll<HTMLElement>(".cert-slide[data-year]"));
    const cardItems = Array.from(track.querySelectorAll<HTMLElement>(".cert-card-item"));

    const useSlides = slideEls.length > 0 && slideEls.length === yearButtons.length;
    const items = useSlides ? slideEls : cardItems;
    const count = items.length;

    if (count === 0 || yearButtons.length === 0) return;

    let prevBtn = document.querySelector<HTMLButtonElement>(".cert-arrow.prev, .cert-nav-prev");
    let nextBtn = document.querySelector<HTMLButtonElement>(".cert-arrow.next, .cert-nav-next");
    let createdArrows: HTMLButtonElement[] = [];

    if ((!prevBtn || !nextBtn) && carousel) {
      const createArrow = (direction: "prev" | "next") => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `cert-arrow cert-nav-${direction} ${direction}`;
        btn.setAttribute("aria-label", direction === "prev" ? "Өмнөх" : "Дараах");
        btn.innerHTML =
          direction === "prev"
            ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>'
            : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>';
        carousel.appendChild(btn);
        return btn;
      };
      if (!prevBtn) prevBtn = createArrow("prev");
      if (!nextBtn) nextBtn = createArrow("next");
      createdArrows = [prevBtn, nextBtn].filter(Boolean) as HTMLButtonElement[];
    }

    let active = 0;
    const activeBtn = yearButtons.find((b) => b.classList.contains("active"));
    if (activeBtn) {
      const year = closestYear(activeBtn);
      if (year) {
        const idx = useSlides
          ? items.findIndex((el) => el.dataset.year === year)
          : yearButtons.findIndex((b) => closestYear(b) === year);
        if (idx >= 0) active = idx;
      }
    }

    function update(index: number) {
      if (index < 0) index = 0;
      if (index >= count) index = count - 1;
      active = index;

      if (carousel) carousel.style.setProperty("--active-index", String(active));

      yearButtons.forEach((btn, i) => {
        const wrap = btn.closest<HTMLElement>(".cert-year-wrap");
        btn.classList.toggle("active", i === active);
        wrap?.classList.toggle("active", i === active);
      });

      items.forEach((item, i) => {
        if (useSlides) {
          item.classList.toggle("hidden", i !== active);
          item.style.display = i === active ? "" : "none";
        } else {
          item.classList.remove("active", "near", "far");
          const diff = Math.abs(i - active);
          if (diff === 0) item.classList.add("active");
          else if (diff === 1) item.classList.add("near");
          else item.classList.add("far");
        }
      });

      if (items[active]) {
        items[active].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }

      if (prevBtn) prevBtn.disabled = active === 0;
      if (nextBtn) nextBtn.disabled = active === count - 1;
    }

    const yearHandlers = yearButtons.map((btn, i) => {
      const handler = (e: MouseEvent) => {
        e.preventDefault();
        update(i);
      };
      const target = btn.closest<HTMLElement>(".cert-year-wrap") || btn;
      target.addEventListener("click", handler);
      return () => target.removeEventListener("click", handler);
    });
    cleanup.push(...yearHandlers);

    const prevHandler = () => update(active - 1);
    const nextHandler = () => update(active + 1);
    prevBtn?.addEventListener("click", prevHandler);
    nextBtn?.addEventListener("click", nextHandler);
    cleanup.push(
      () => prevBtn?.removeEventListener("click", prevHandler),
      () => nextBtn?.removeEventListener("click", nextHandler)
    );

    const thumbSelector = useSlides
      ? ".cert-slide[data-year] .cert-card img"
      : ".cert-card-item .cert-card img";
    const thumbs = document.querySelectorAll<HTMLImageElement>(thumbSelector);
    const thumbHandlers = Array.from(thumbs).map((img) => {
      img.style.cursor = "zoom-in";
      const handler = () => setLightbox({ src: img.src, alt: img.alt || "Сертификат" });
      img.addEventListener("click", handler);
      return () => img.removeEventListener("click", handler);
    });
    cleanup.push(...thumbHandlers);

    update(active);

    return () => {
      cleanup.forEach((fn) => fn());
      createdArrows.forEach((btn) => btn.remove());
    };
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  return (
    <div aria-hidden="true">
      {mounted && lightbox &&
        createPortal(
          <div
            className="cert-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Сертификат харах"
            onClick={() => setLightbox(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              background: "rgba(20,35,27,0.88)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
              cursor: "zoom-out",
            }}
          >
            <button
              type="button"
              className="cert-lightbox-close"
              aria-label="Хаах"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(null);
              }}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "none",
                background: "#fff",
                color: "#14231B",
                fontSize: 24,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(20,35,27,0.12)",
              }}
            >
              ×
            </button>
            <img
              className="cert-lightbox-img"
              src={lightbox.src}
              alt={lightbox.alt}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                borderRadius: 12,
                objectFit: "contain",
                background: "#fff",
                boxShadow: "0 24px 60px rgba(20,35,27,0.25)",
              }}
            />
          </div>,
          document.body
        )}
    </div>
  );
}
