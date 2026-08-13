"use client";

import { useEffect } from "react";

const PINE_BENEFITS = [
  {
    title: "Зүрх судас",
    desc: "Хушны самар нь зүрх судасны эрүүл мэндийг дэмжих, холестерины хэмжээг тэнцвэржүүлэхэд тустай.",
  },
  {
    title: "Дархлаа дэм",
    desc: "Витамин, эрдэс бодисоор баялаг тул дархлааны системийг идэвхжүүлж, өвчин эсэргүүцэх чадварыг нэмэгдүүлнэ.",
  },
  {
    title: "Арьс, үс",
    desc: "Тос, амин хүчлүүд арьсыг чийгшүүлж, үсийг тэжээхэд тустай.",
  },
  {
    title: "Уураг, эрдэс",
    desc: "Байгалийн уураг, магни, фосфор, төмөр зэрэг эрдэсээр баялаг.",
  },
  {
    title: "Хамгаалалт",
    desc: "Е витамин, селен зэрэг антиоксидантаар баялаг бөгөөд эсийн өөрчлөлтөөс хамгаална.",
  },
  {
    title: "Эрч хүч",
    desc: "Уураг, хүндлэн задрах нүүрс усаар баялаг тул өдөр тутмын эрч хүчийг нэмэгдүүлнэ.",
  },
];

function getEventX(e: MouseEvent | TouchEvent): number {
  if ("touches" in e && e.touches.length > 0) {
    return e.touches[0].pageX;
  }
  return (e as MouseEvent).pageX;
}

function formatWithSeparator(n: number, separator: string): string {
  const s = Math.round(n).toString();
  if (!separator) return s;
  const parts: string[] = [];
  for (let i = s.length; i > 0; i -= 3) {
    parts.unshift(s.slice(Math.max(0, i - 3), i));
  }
  return parts.join(separator);
}

function animateStatNumber(el: HTMLElement) {
  const original = el.textContent || "";
  el.setAttribute("data-original", original);

  const match = original.match(/([0-9\s,.]+)/);
  if (!match) return;

  const raw = match[1].replace(/[\s,]/g, "");
  const isFloat = raw.includes(".");
  const final = isFloat ? parseFloat(raw) : parseInt(raw, 10);
  if (Number.isNaN(final)) return;

  const prefix = original.slice(0, match.index);
  const suffix = original.slice((match.index || 0) + match[0].length);
  const separator = match[1].includes(",") ? "," : match[1].includes(" ") ? " " : "";

  const duration = 1800;
  const start = performance.now();

  const tick = (now: number) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const current = final * eased;
    const text = isFloat
      ? current.toFixed(1)
      : formatWithSeparator(current, separator);
    el.textContent = `${prefix}${text}${suffix}`;
    if (p < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = original;
    }
  };

  requestAnimationFrame(tick);
}

function initHeroVideo() {
  const video = document.querySelector<HTMLVideoElement>(".hero-video-bg");
  if (!video) return;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.play().catch(() => {
    // Autoplay may be blocked by the browser; ignore.
  });
}

function initStatCounters() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".stats .stat-number")
  );
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStatNumber(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  elements.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}

function initReelsCarousel() {
  const track = document.getElementById("apReelsTrack");
  const prevBtn = document.getElementById("apReelPrev");
  const nextBtn = document.getElementById("apReelNext");
  if (!track) return;

  const getScrollAmount = () => {
    const card = track.querySelector<HTMLElement>(".ap-reel-card");
    const gap = parseInt(getComputedStyle(track).gap || "0", 10) || 24;
    return card ? card.offsetWidth + gap : 344;
  };

  const onPrev = () =>
    track.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
  const onNext = () =>
    track.scrollBy({ left: getScrollAmount(), behavior: "smooth" });

  prevBtn?.addEventListener("click", onPrev);
  nextBtn?.addEventListener("click", onNext);

  // Drag / swipe scroll
  let isDown = false;
  let startX = 0;
  let scrollStart = 0;
  let isDragging = false;
  let preventNextClick = false;
  let velocity = 0;
  let lastScroll = 0;
  let lastTime = 0;
  let glideRaf: number | null = null;
  const dragThreshold = 4;

  const onDown = (e: MouseEvent | TouchEvent) => {
    isDown = true;
    isDragging = false;
    preventNextClick = false;
    startX = getEventX(e) - track.offsetLeft;
    scrollStart = track.scrollLeft;
    track.classList.add("is-pressed");
    lastScroll = track.scrollLeft;
    lastTime = performance.now();
  };

  const onUp = () => {
    if (!isDown) return;
    isDown = false;
    track.classList.remove("is-pressed", "is-dragging");
    if (isDragging) {
      preventNextClick = true;
      setTimeout(() => {
        preventNextClick = false;
      }, 50);
      let v = velocity;
      const glide = () => {
        if (Math.abs(v) < 0.5) return;
        track.scrollLeft += v * 16;
        v *= 0.92;
        glideRaf = requestAnimationFrame(glide);
      };
      glide();
    }
    isDragging = false;
    velocity = 0;
  };

  const onMove = (e: MouseEvent | TouchEvent) => {
    if (!isDown) return;
    if (e.cancelable && e.type === "touchmove") e.preventDefault();
    const x = getEventX(e) - track.offsetLeft;
    const walk = (x - startX) * 1.6;
    if (Math.abs(walk) > dragThreshold) {
      isDragging = true;
      track.classList.add("is-dragging");
    }
    track.scrollLeft = scrollStart - walk;
    const now = performance.now();
    const dt = now - lastTime;
    if (dt > 0) {
      velocity = (track.scrollLeft - lastScroll) / dt;
    }
    lastScroll = track.scrollLeft;
    lastTime = now;
  };

  const onClickCapture = (e: MouseEvent) => {
    if (preventNextClick) {
      e.preventDefault();
      e.stopPropagation();
      preventNextClick = false;
    }
  };

  track.addEventListener("mousedown", onDown);
  track.addEventListener("touchstart", onDown, { passive: true });
  track.addEventListener("mouseleave", onUp);
  track.addEventListener("mouseup", onUp);
  track.addEventListener("touchend", onUp);
  track.addEventListener("mousemove", onMove);
  track.addEventListener("touchmove", onMove, { passive: false });
  track.addEventListener("click", onClickCapture, true);

  // Continuous auto-scroll
  let isPaused = false;
  const scrollSpeed = 0.6;
  let autoRaf: number | null = null;

  const autoScroll = () => {
    if (!isPaused) {
      track.scrollLeft += scrollSpeed;
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 1) {
        track.scrollLeft = 0;
      }
    }
    autoRaf = requestAnimationFrame(autoScroll);
  };

  const pause = () => {
    isPaused = true;
  };
  const resume = () => {
    isPaused = false;
  };

  track.addEventListener("mouseenter", pause);
  track.addEventListener("mouseleave", resume);
  track.addEventListener("mousedown", pause);
  window.addEventListener("mouseup", resume);
  track.addEventListener("touchstart", pause, { passive: true });
  track.addEventListener("touchend", resume);

  autoScroll();

  // Video hover preview + click-to-play with sound
  const videoCards = track.querySelectorAll<HTMLElement>(".ap-reel-card.video");
  const videoCleanups: Array<() => void> = [];

  videoCards.forEach((card) => {
    const video = card.querySelector<HTMLVideoElement>("video");
    const btn = card.querySelector<HTMLButtonElement>(".ap-reel-play");
    if (!video || !btn) return;

    let wasClicked = false;
    const showBtn = () => btn.classList.remove("hidden");
    const hideBtn = () => btn.classList.add("hidden");

    const onMouseEnter = () => {
      if (wasClicked) return;
      video.muted = true;
      video.play().catch(() => {});
      hideBtn();
    };

    const onMouseLeave = () => {
      if (wasClicked) return;
      video.pause();
      video.currentTime = 0;
      showBtn();
    };

    const onBtnClick = (e: Event) => {
      e.stopPropagation();
      if (video.paused) {
        document
          .querySelectorAll<HTMLVideoElement>(".ap-reel-card.video video")
          .forEach((v) => {
            if (v !== video) {
              v.pause();
              const otherCard = v.closest<HTMLElement>(".ap-reel-card.video");
              const otherBtn =
                otherCard?.querySelector<HTMLButtonElement>(".ap-reel-play");
              if (otherBtn) otherBtn.classList.remove("hidden");
            }
          });
        wasClicked = true;
        video.muted = false;
        video.play().catch(() => {});
        hideBtn();
      } else {
        wasClicked = false;
        video.pause();
        video.currentTime = 0;
        showBtn();
      }
    };

    const onEnded = () => {
      wasClicked = false;
      video.currentTime = 0;
      showBtn();
    };

    card.addEventListener("mouseenter", onMouseEnter);
    card.addEventListener("mouseleave", onMouseLeave);
    btn.addEventListener("click", onBtnClick);
    video.addEventListener("ended", onEnded);

    videoCleanups.push(() => {
      card.removeEventListener("mouseenter", onMouseEnter);
      card.removeEventListener("mouseleave", onMouseLeave);
      btn.removeEventListener("click", onBtnClick);
      video.removeEventListener("ended", onEnded);
    });
  });

  return () => {
    prevBtn?.removeEventListener("click", onPrev);
    nextBtn?.removeEventListener("click", onNext);
    track.removeEventListener("mousedown", onDown);
    track.removeEventListener("touchstart", onDown);
    track.removeEventListener("mouseleave", onUp);
    track.removeEventListener("mouseup", onUp);
    track.removeEventListener("touchend", onUp);
    track.removeEventListener("mousemove", onMove);
    track.removeEventListener("touchmove", onMove);
    track.removeEventListener("click", onClickCapture, true);
    track.removeEventListener("mouseenter", pause);
    track.removeEventListener("mouseleave", resume);
    track.removeEventListener("mousedown", pause);
    window.removeEventListener("mouseup", resume);
    track.removeEventListener("touchstart", pause);
    track.removeEventListener("touchend", resume);
    if (glideRaf) cancelAnimationFrame(glideRaf);
    if (autoRaf) cancelAnimationFrame(autoRaf);
    videoCleanups.forEach((fn) => fn());
  };
}

function initPineBenefits() {
  const section = document.querySelector<HTMLElement>(".pine-benefits-section");
  if (!section) return;

  const nodes = Array.from(section.querySelectorAll<HTMLElement>(".hex-node"));
  const labels = Array.from(section.querySelectorAll<HTMLElement>(".hex-label"));
  const centerNumber = section.querySelector<HTMLElement>(".hex-center-number");
  const centerTitle = section.querySelector<HTMLElement>(".hex-center-title");
  const centerDesc = section.querySelector<HTMLElement>(".hex-center-desc");
  const detailNumber = section.querySelector<HTMLElement>(".benefit-detail-number");
  const detailTitle = section.querySelector<HTMLElement>(".benefit-detail-title");
  const detailText = section.querySelector<HTMLElement>(".benefit-detail-text");
  const center = section.querySelector<HTMLElement>(".hex-center-content");
  const right = section.querySelector<HTMLElement>(".pine-benefits-right");

  if (!nodes.length || !centerTitle) return;

  let currentIndex = 1;

  const updateContent = (index: number) => {
    const b = PINE_BENEFITS[index - 1];
    if (!b) return;
    nodes.forEach((n) => {
      const nodeIndex = parseInt(n.getAttribute("data-index") || "0", 10);
      n.classList.toggle("active", nodeIndex === index);
    });
    labels.forEach((l, i) => l.classList.toggle("active", i === index - 1));
    if (centerNumber) centerNumber.textContent = String(index);
    if (centerTitle) centerTitle.textContent = b.title;
    if (centerDesc) centerDesc.textContent = b.desc;
    if (detailNumber)
      detailNumber.textContent = String(index).padStart(2, "0");
    if (detailTitle) detailTitle.textContent = b.title;
    if (detailText) detailText.textContent = b.desc;
    currentIndex = index;
  };

  const selectBenefit = (index: number) => {
    if (center && right) {
      center.classList.add("is-changing");
      right.classList.add("is-changing");
      setTimeout(() => {
        updateContent(index);
        center.classList.remove("is-changing");
        right.classList.remove("is-changing");
      }, 500);
    } else {
      updateContent(index);
    }
  };

  const nextBenefit = () => {
    const next = (currentIndex % PINE_BENEFITS.length) + 1;
    selectBenefit(next);
  };

  let timer: ReturnType<typeof setInterval> | null = null;
  const startAuto = () => {
    if (timer) return;
    timer = setInterval(nextBenefit, 3500);
  };
  const stopAuto = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const nodeCleanups = nodes.map((node) => {
    const handler = () => {
      stopAuto();
      const index = parseInt(node.getAttribute("data-index") || "1", 10);
      selectBenefit(index);
    };
    node.addEventListener("click", handler);
    return () => node.removeEventListener("click", handler);
  });

  const diagram = section.querySelector<HTMLElement>(".pine-benefits-diagram");
  diagram?.addEventListener("mouseenter", stopAuto);
  diagram?.addEventListener("mouseleave", startAuto);

  updateContent(currentIndex);
  startAuto();

  return () => {
    stopAuto();
    nodeCleanups.forEach((fn) => fn());
    diagram?.removeEventListener("mouseenter", stopAuto);
    diagram?.removeEventListener("mouseleave", startAuto);
  };
}

function initTestimonialsCarousel() {
  const track = document.querySelector<HTMLElement>(".testimonials-carousel");
  if (!track) return;

  const wrapper = track.closest<HTMLElement>(".testimonials-carousel-wrapper");
  const slides = Array.from(track.children) as HTMLElement[];
  if (!slides.length) return;

  let prevBtn = document.querySelector<HTMLButtonElement>(".testimonials-prev");
  let nextBtn = document.querySelector<HTMLButtonElement>(".testimonials-next");
  const createdArrows: HTMLButtonElement[] = [];

  if ((!prevBtn || !nextBtn) && wrapper) {
    const createArrow = (direction: "prev" | "next") => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `testimonials-arrow testimonials-${direction}`;
      btn.setAttribute("aria-label", direction === "prev" ? "Өмнөх" : "Дараах");
      btn.innerHTML =
        direction === "prev"
          ? '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>'
          : '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';
      wrapper.appendChild(btn);
      return btn;
    };
    if (!prevBtn) prevBtn = createArrow("prev");
    if (!nextBtn) nextBtn = createArrow("next");
    createdArrows.push(prevBtn, nextBtn);
  }

  const dots = wrapper?.querySelectorAll<HTMLElement>(".testimonials-dot");

  let currentIndex = 0;

  const getSlideWidth = () => slides[0]?.offsetWidth || track.clientWidth;

  const updateDots = (index: number) => {
    dots?.forEach((dot, i) => dot.classList.toggle("active", i === index));
  };

  const goTo = (index: number) => {
    const idx = Math.max(0, Math.min(index, slides.length - 1));
    currentIndex = idx;
    track.scrollTo({ left: idx * getSlideWidth(), behavior: "smooth" });
    updateDots(idx);
  };

  const prevHandler = () => goTo(currentIndex - 1);
  const nextHandler = () => goTo(currentIndex + 1);
  prevBtn?.addEventListener("click", prevHandler);
  nextBtn?.addEventListener("click", nextHandler);

  const dotHandlers = dots
    ? Array.from(dots).map((dot, i) => {
        const handler = () => goTo(i);
        dot.addEventListener("click", handler);
        return () => dot.removeEventListener("click", handler);
      })
    : [];

  const onScroll = () => {
    const idx = Math.round(track.scrollLeft / getSlideWidth());
    currentIndex = Math.max(0, Math.min(idx, slides.length - 1));
    updateDots(currentIndex);
  };
  track.addEventListener("scroll", onScroll, { passive: true });

  updateDots(0);

  return () => {
    prevBtn?.removeEventListener("click", prevHandler);
    nextBtn?.removeEventListener("click", nextHandler);
    dotHandlers.forEach((fn) => fn());
    track.removeEventListener("scroll", onScroll);
    createdArrows.forEach((btn) => btn.remove());
  };
}

export function HomeClient() {
  useEffect(() => {
    initHeroVideo();
    const cleanupStats = initStatCounters();
    const cleanupReels = initReelsCarousel();
    const cleanupPine = initPineBenefits();
    const cleanupTestimonials = initTestimonialsCarousel();

    return () => {
      cleanupStats?.();
      cleanupReels?.();
      cleanupPine?.();
      cleanupTestimonials?.();
    };
  }, []);

  return null;
}
