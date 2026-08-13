"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "hushkhan_cart";

function getCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return (cart || []).reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
  } catch {
    return 0;
  }
}

export function useCartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getCount());
    const interval = setInterval(() => setCount(getCount()), 500);
    const onStorage = () => setCount(getCount());
    window.addEventListener("storage", onStorage);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return count;
}
