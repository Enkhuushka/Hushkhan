"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

export interface CartItem {
  id: string;
  title: string;
  image: string;
  optionLabel: string;
  price: number;
  originalPrice: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  originalTotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (
    id: string,
    optionLabel: string,
    price: number,
    originalPrice: number,
    title: string,
    image: string,
    quantity?: number
  ) => void;
  changeQty: (index: number, delta: number) => void;
  removeItem: (index: number) => void;
  upsellAdd: (key: string) => void;
  formatPrice: (n: number) => string;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "hushkhan_cart";

export const PRODUCTS: Record<string, Pick<CartItem, "title" | "image" | "price" | "originalPrice">> = {
  roasted: { title: "Шарсан хушны самар", image: "/assets/products/roasted.jpg", price: 45000, originalPrice: 52000 },
  raw: { title: "Цэвэр хушны самар", image: "/assets/products/raw.jpg", price: 52000, originalPrice: 60000 },
  oil: { title: "Хушны самрын тос", image: "/assets/products/oil.jpg", price: 78000, originalPrice: 90000 },
  gift: { title: "HushKhan бэлэг багц", image: "/assets/products/gift.jpg", price: 158000, originalPrice: 180000 },
  honey: { title: "Зөгийн балтай самар", image: "/assets/products/honey.jpg", price: 58500, originalPrice: 68000 },
  chocolate: { title: "Самрын шоколад", image: "/assets/products/chocolate.jpg", price: 43200, originalPrice: 50000 },
  "oil-small": { title: "Самрын тос жижиг лонх", image: "/assets/products/oil.jpg", price: 0, originalPrice: 25000 },
  mystery: { title: "HushKhan Mystery Bag", image: "/assets/products/gift.jpg", price: 35000, originalPrice: 50000 },
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, mounted]);

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const originalTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0),
    [items]
  );

  const formatPrice = (n: number) =>
    n.toLocaleString("mn-MN").replace(/,/g, " ") + "₮";

  const addToCart = (
    id: string,
    optionLabel: string,
    price: number,
    originalPrice: number,
    title: string,
    image: string,
    quantity: number = 1
  ) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.id === id && i.optionLabel === optionLabel
      );
      if (existing) {
        return prev.map((i) =>
          i.id === id && i.optionLabel === optionLabel
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        { id, title, image, optionLabel, price, originalPrice, quantity },
      ];
    });
    setIsOpen(true);
  };

  const changeQty = (index: number, delta: number) => {
    setItems((prev) => {
      const next = [...prev];
      if (!next[index]) return prev;
      next[index].quantity += delta;
      if (next[index].quantity <= 0) next.splice(index, 1);
      return next;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  const upsellAdd = (key: string) => {
    const p = PRODUCTS[key];
    if (!p) return;
    addToCart(key, "Нэг удаагийн", p.price, p.originalPrice, p.title, p.image);
  };

  const value = useMemo(
    () => ({
      items,
      count,
      total,
      originalTotal,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addToCart,
      changeQty,
      removeItem,
      upsellAdd,
      formatPrice,
    }),
    [items, count, total, originalTotal, isOpen]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

function CartDrawer() {
  const {
    items,
    count,
    total,
    originalTotal,
    isOpen,
    closeCart,
    changeQty,
    removeItem,
    upsellAdd,
    formatPrice,
  } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  const checkout = () => {
    if (!items.length) {
      alert("Сагс хоосон байна.");
      return;
    }
    window.location.href = "/shop/checkout";
  };

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? "open" : ""}`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside className={`cart-drawer ${isOpen ? "open" : ""}`} aria-label="Shopping cart">
        <div className="cart-drawer-header">
          <h2>
            Таны сагс <span>({count})</span>
          </h2>
          <button className="cart-close" onClick={closeCart} aria-label="Хаах">
            ×
          </button>
        </div>
        <div className="cart-drawer-body">
          <div className="cart-upsell">
            <p className="cart-upsell-title">Үнэгүй бэлэг аваарай</p>
            <div className="cart-upsell-product">
              <img src="/assets/products/oil.jpg" alt="Самрын тос жижиг" />
              <div>
                <h4>Самрын тос жижиг лонх</h4>
                <p>
                  Үнэгүй <s>25,000₮</s>
                </p>
              </div>
              <button className="btn-add-cart-sm" onClick={() => upsellAdd("oil-small")}>
                Нэмэх
              </button>
            </div>
          </div>

          <div className="cart-items">
            {items.length === 0 ? (
              <div className="cart-empty">Сагс хоосон байна.</div>
            ) : (
              items.map((item, index) => (
                <div className="cart-item" key={`${item.id}-${item.optionLabel}`}>
                  <img src={item.image} alt={item.title} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h4>{item.title}</h4>
                    <p className="cart-item-option">{item.optionLabel}</p>
                  </div>
                  <div className="cart-item-actions">
                    <div className="qty-stepper">
                      <button className="qty-btn minus" onClick={() => changeQty(index, -1)} aria-label="Багасгах">
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn plus" onClick={() => changeQty(index, 1)} aria-label="Нэмэх">
                        +
                      </button>
                    </div>
                    <button className="cart-item-remove" onClick={() => removeItem(index)}>
                      Хасах
                    </button>
                  </div>
                  <div className="cart-item-price">{formatPrice(item.price * item.quantity)}</div>
                </div>
              ))
            )}
          </div>

          <div className="cart-upsell">
            <p className="cart-upsell-title">Нууц бэлэг багц</p>
            <div className="cart-upsell-product">
              <img src="/assets/products/gift.jpg" alt="Нууц багц" />
              <div>
                <h4>HushKhan Mystery Bag</h4>
                <p>
                  Зөвхөн 35,000₮ <s>50,000₮</s>
                </p>
              </div>
              <button className="btn-add-cart-sm" onClick={() => upsellAdd("mystery")}>
                Нэмэх
              </button>
            </div>
          </div>

          <div className="cart-also-bought">
            <p className="cart-upsell-title">Үүнтэй хамт авдаг</p>
            <div className="also-bought-list">
              {["chocolate", "honey", "raw"].map((key) => {
                const p = PRODUCTS[key];
                if (!p) return null;
                return (
                  <div className="also-bought-item" key={key}>
                    <img src={p.image} alt={p.title} />
                    <p>{p.title}</p>
                    <button onClick={() => upsellAdd(key)}>Нэмэх</button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="cart-drawer-footer">
          <div className="cart-guarantee">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Мөнгө буцаах баталгаа
          </div>
          <button className="btn-checkout" onClick={checkout}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            ТӨЛБӨР ТӨЛӨХ · {formatPrice(total)} <s>{formatPrice(originalTotal)}</s>
          </button>
        </div>
      </aside>
    </>
  );
}
