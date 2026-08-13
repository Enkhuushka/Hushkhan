"use client";

import { useEffect } from "react";

export default function LocationsClient() {
  useEffect(() => {
    const search = document.querySelector<HTMLInputElement>(
      "#locationSearch, .location-search, #storeSearch"
    );
    const list = document.querySelector<HTMLElement>(
      "#locationList, .location-list, #storeList"
    );
    const city = document.querySelector<HTMLSelectElement>(
      "#locationCity, .location-city, #storeCity"
    );
    const countEl = document.querySelector<HTMLElement>(
      "#locationCount, .location-count"
    );
    const districtButtons = document.querySelectorAll<HTMLElement>(
      ".location-district-btn, .district-filter, [data-district-filter]"
    );

    if (!list) return;

    const cards = Array.from(
      list.querySelectorAll<HTMLElement>(".location-card, .shop-location-card")
    );

    if (cards.length === 0) return;

    // Insert a visible count element if the markup doesn't already have one.
    let liveCount = countEl;
    if (!liveCount && search) {
      liveCount = document.createElement("span");
      liveCount.id = "locationCount";
      liveCount.className = "location-count";
      liveCount.style.cssText =
        "margin-left: 12px; font-size: 14px; color: #6b7a6f;";
      const searchContainer = search.closest<HTMLElement>(
        ".shop-locations-search, .location-search-wrapper, .location-search"
      );
      if (searchContainer) {
        searchContainer.appendChild(liveCount);
      } else {
        search.parentElement?.appendChild(liveCount);
      }
    }

    function updateCount(visible: number) {
      if (liveCount) liveCount.textContent = `${visible} үр дүн`;
    }

    function filter() {
      const q = (search?.value || "").trim().toLowerCase();
      const selectedCity = (city?.value || "all").trim();
      const activeDistrict = Array.from(districtButtons).find((btn) =>
        btn.classList.contains("active")
      );
      const district = activeDistrict?.getAttribute("data-district") || "";

      let visible = 0;
      cards.forEach((card) => {
        const text = card.textContent?.toLowerCase() || "";
        const dataDistrict = card.getAttribute("data-district") || "";
        const dataCity = card.getAttribute("data-city") || "";

        const matchesSearch = !q || text.includes(q);
        const matchesCity =
          selectedCity === "all" ||
          dataCity === selectedCity ||
          text.includes(selectedCity.toLowerCase());
        const matchesDistrict =
          !district ||
          dataDistrict === district ||
          text.includes(district.toLowerCase());

        const show = matchesSearch && matchesCity && matchesDistrict;
        card.style.display = show ? "" : "none";
        if (show) visible++;
      });

      updateCount(visible);

      // Show a friendly empty state if no results match.
      if (!list) return;
      const existingEmpty = list.querySelector<HTMLElement>(".location-empty-state");
      if (visible === 0) {
        if (!existingEmpty) {
          const empty = document.createElement("div");
          empty.className = "location-empty-state";
          empty.style.cssText =
            "padding: 24px 0; color: #6b7a6f; font-size: 15px; text-align: center;";
          empty.textContent = "Таны хайлтад тохирох дэлгүүр олдсонгүй.";
          list.appendChild(empty);
        }
      } else if (existingEmpty) {
        existingEmpty.remove();
      }
    }

    search?.addEventListener("input", filter);
    city?.addEventListener("change", filter);

    const districtHandlers: (() => void)[] = [];
    districtButtons.forEach((btn) => {
      const handler = () => {
        districtButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        filter();
      };
      btn.addEventListener("click", handler);
      districtHandlers.push(() => btn.removeEventListener("click", handler));
    });

    filter();

    return () => {
      search?.removeEventListener("input", filter);
      city?.removeEventListener("change", filter);
      districtHandlers.forEach((fn) => fn());
      if (liveCount && !countEl) liveCount.remove();
    };
  }, []);

  return null;
}
