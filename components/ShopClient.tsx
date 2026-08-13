"use client";

import { useEffect } from "react";

function formatPrice(n: number): string {
  return n.toLocaleString("mn-MN").replace(/,/g, " ") + "₮";
}

export function ShopClient() {
  useEffect(() => {
    const grid = document.getElementById("collectionsGrid");
    const countEl = document.getElementById("productCount");
    const sortSelect = document.getElementById(
      "sortSelect"
    ) as HTMLSelectElement | null;
    const buttons = Array.from(document.querySelectorAll(".shop-category"));

    if (!grid) return;

    const gridEl = grid;
    const productCards = Array.from(gridEl.querySelectorAll(".shop-card"));
    const editorial = gridEl.querySelector(".shop-editorial");

    function updateCount() {
      const visible = productCards.filter(
        (card) => (card as HTMLElement).style.display !== "none"
      );
      if (countEl) countEl.textContent = String(visible.length);
    }

    function applyFilter(filter: string) {
      productCards.forEach((card) => {
        const category = (card as HTMLElement).dataset.category;
        const visible = filter === "all" || category === filter;
        (card as HTMLElement).style.display = visible ? "" : "none";
      });
      if (editorial) {
        (editorial as HTMLElement).style.display =
          filter === "all" || filter === "gift" ? "" : "none";
      }
      updateCount();
    }

    function sortCards(sort: string) {
      if (!grid) return;
      const sorted = productCards.slice();
      sorted.sort((a, b) => {
        const ae = a as HTMLElement;
        const be = b as HTMLElement;
        if (sort === "price-asc") {
          return Number(ae.dataset.price) - Number(be.dataset.price);
        }
        if (sort === "price-desc") {
          return Number(be.dataset.price) - Number(ae.dataset.price);
        }
        if (sort === "name") {
          return String(ae.dataset.name).localeCompare(String(be.dataset.name));
        }
        return Number(ae.dataset.popular) - Number(be.dataset.popular);
      });
      sorted.forEach((card) => gridEl.appendChild(card));
      if (editorial) gridEl.appendChild(editorial);
    }

    const onCategoryClick = (e: Event) => {
      const btn = e.currentTarget as HTMLElement;
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilter(btn.dataset.filter || "all");
    };

    buttons.forEach((btn) => btn.addEventListener("click", onCategoryClick));

    const onSortChange = () => {
      if (!sortSelect) return;
      sortCards(sortSelect.value);
    };

    sortSelect?.addEventListener("change", onSortChange);

    updateCount();

    return () => {
      buttons.forEach((btn) => btn.removeEventListener("click", onCategoryClick));
      sortSelect?.removeEventListener("change", onSortChange);
    };
  }, []);

  return null;
}
