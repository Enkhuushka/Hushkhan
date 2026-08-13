"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import "@/styles/shop/shop-shared.css";

export default function CartPage() {
  const { items, changeQty, removeItem, total, originalTotal, formatPrice } =
    useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shipping = total >= 150000 ? 0 : 5000;

  return (
    <>
      <section className="page-hero">
        <img
          src="/assets/hero-product.jpg"
          alt="Сагс"
          className="page-hero-bg"
        />
        <div className="page-hero-overlay" />
        <div className="container">
          <div className="page-hero-eyebrow">Дэлгүүр</div>
          <h1 className="display">Сагс</h1>
        </div>
      </section>

      <section className="container">
        <div className="cart-layout">
          <div className="cart-list">
            {!mounted || items.length === 0 ? (
              <div className="empty-cart">
                <h2>Сагс хоосон байна</h2>
                <p>Онлайн дэлгүүрээс бүтээгдэхүүн сонгоорой.</p>
                <Link href="/shop" className="btn btn-primary">
                  Дэлгүүр рүү буцах
                </Link>
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  className="page-cart-item"
                  key={`${item.id}-${item.optionLabel}`}
                >
                  <img src={item.image} alt={item.title} />
                  <div className="page-cart-item-info">
                    <h3>{item.title}</h3>
                    <p>{item.optionLabel}</p>
                  </div>
                  <div className="page-cart-item-actions">
                    <div className="qty-stepper">
                      <button
                        className="qty-btn minus"
                        onClick={() => changeQty(index, -1)}
                        aria-label="Багасгах"
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn plus"
                        onClick={() => changeQty(index, 1)}
                        aria-label="Нэмэх"
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeItem(index)}
                    >
                      Хасах
                    </button>
                  </div>
                  <div className="page-cart-item-price">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="cart-summary-card">
            <h3 className="display">Захиалгын мэдээлэл</h3>
            <div className="summary-row">
              <span>Бүтээгдэхүүн</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="summary-row">
              <span>Хүргэлт</span>
              <span>
                {shipping === 0 ? "Үнэгүй" : formatPrice(shipping)}
              </span>
            </div>
            <div className="summary-row total">
              <span>Нийт</span>
              <span>{formatPrice(total + shipping)}</span>
            </div>
            <small
              style={{
                display: "block",
                textAlign: "right",
                color: "var(--color-walnut)",
                textDecoration: "line-through",
                marginTop: 8,
              }}
            >
              {formatPrice(originalTotal + shipping)}
            </small>
            <Link
              href="/shop/checkout"
              className="btn btn-primary btn-full"
            >
              Захиалах
            </Link>
            <Link
              href="/shop"
              className="btn btn-outline btn-full"
              style={{ marginTop: 12 }}
            >
              Дэлгүүр рүү буцах
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
