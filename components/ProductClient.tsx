"use client";

import { useEffect } from "react";
import { useCart } from "@/components/CartProvider";

function formatPrice(n: number): string {
  return n.toLocaleString("mn-MN").replace(/,/g, " ") + "₮";
}

interface ProductClientProps {
  slug: string;
}

export function ProductClient({ slug }: ProductClientProps) {
  const { addToCart } = useCart();

  useEffect(() => {
    const mainImage = document.getElementById("mainImage") as HTMLImageElement | null;
    const thumbs = Array.from(document.querySelectorAll(".product-thumb"));
    const sizeOptions = Array.from(document.querySelectorAll(".size-option"));
    const priceEl = document.querySelector(".product-price");
    const qtyInput = document.querySelector(
      ".quantity input"
    ) as HTMLInputElement | null;
    const addBtn = document.querySelector(".btn-add-to-cart");

    const handleThumbClick = (e: Event) => {
      const thumb = e.currentTarget as HTMLElement;
      const img = thumb.querySelector("img") as HTMLImageElement | null;
      if (!mainImage || !img) return;
      mainImage.src = img.src;
      mainImage.alt = img.alt;
      thumbs.forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
    };

    const handleSizeClick = (e: Event) => {
      const option = e.currentTarget as HTMLElement;
      sizeOptions.forEach((o) => o.classList.remove("active"));
      option.classList.add("active");
      const price = option.dataset.price;
      const original = option.dataset.original;
      if (!price || !original || !priceEl) return;
      priceEl.innerHTML = `${formatPrice(Number(price))} <s>${formatPrice(
        Number(original)
      )}</s>`;
    };

    const enforceQtyRange = () => {
      if (!qtyInput) return;
      let value = Number(qtyInput.value);
      if (Number.isNaN(value)) value = 1;
      value = Math.max(1, Math.min(20, value));
      qtyInput.value = String(value);
    };

    const handleAddToCart = () => {
      if (!addBtn || !qtyInput) return;
      const selected = document.querySelector(".size-option.active") as HTMLElement | null;
      if (!selected) return;
      const title = addBtn.getAttribute("data-title") || "";
      const image = addBtn.getAttribute("data-image") || "";
      const price = Number(selected.dataset.price || "0");
      const originalPrice = Number(selected.dataset.original || "0");
      const optionLabel = selected.textContent?.trim() || "";
      const quantity = Math.max(
        1,
        Math.min(20, Number(qtyInput.value) || 1)
      );
      addToCart(slug, optionLabel, price, originalPrice, title, image, quantity);
    };

    thumbs.forEach((t) => t.addEventListener("click", handleThumbClick));
    sizeOptions.forEach((o) => o.addEventListener("click", handleSizeClick));
    qtyInput?.addEventListener("input", enforceQtyRange);
    qtyInput?.addEventListener("change", enforceQtyRange);
    addBtn?.addEventListener("click", handleAddToCart);

    return () => {
      thumbs.forEach((t) => t.removeEventListener("click", handleThumbClick));
      sizeOptions.forEach((o) =>
        o.removeEventListener("click", handleSizeClick)
      );
      qtyInput?.removeEventListener("input", enforceQtyRange);
      qtyInput?.removeEventListener("change", enforceQtyRange);
      addBtn?.removeEventListener("click", handleAddToCart);
    };
  }, [slug, addToCart]);

  return null;
}
