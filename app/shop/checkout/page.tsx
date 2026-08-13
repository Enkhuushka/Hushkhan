"use client";

import Link from "next/link";
import { useEffect, useState, FormEvent } from "react";
import { useCart } from "@/components/CartProvider";
import "@/styles/shop/shop-shared.css";

export default function CheckoutPage() {
  const { items, total, originalTotal, formatPrice, removeItem } = useCart();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState("qpay");

  useEffect(() => {
    setMounted(true);
  }, []);

  const shipping = total >= 150000 ? 0 : 5000;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Сагс хоосон байна.");
      return;
    }
    alert("Захиалга хүлээн авлаа. Баярлалаа!");
    for (let i = items.length - 1; i >= 0; i--) {
      removeItem(i);
    }
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setNote("");
    setPayment("qpay");
  };

  return (
    <>
      <section className="page-hero">
        <img
          src="/assets/hero-product.jpg"
          alt="Захиалга баталгаажуулах"
          className="page-hero-bg"
        />
        <div className="page-hero-overlay" />
        <div className="container">
          <div className="page-hero-eyebrow">Дэлгүүр</div>
          <h1 className="display">Захиалга баталгаажуулах</h1>
        </div>
      </section>

      <section className="container">
        <div className="checkout-layout">
          <div className="checkout-form">
            <h2 className="display">Хүргэлтийн мэдээлэл</h2>
            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="form-group full">
                <label htmlFor="name">Нэр</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Нэр"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group full">
                <label htmlFor="phone">Утас</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+976 9911 2233"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="form-group full">
                <label htmlFor="email">И-мэйл</label>
                <input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group full">
                <label htmlFor="address">Хүргэлтийн хаяг</label>
                <textarea
                  id="address"
                  placeholder="Дүүрэг, хороо, байр, тоот"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="form-group full">
                <label htmlFor="note">Тэмдэглэл</label>
                <textarea
                  id="note"
                  placeholder="Нэмэлт тэмдэглэл"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <h2
                className="display"
                style={{ gridColumn: "1 / -1", marginTop: 24 }}
              >
                Төлбөрийн хэлбэр
              </h2>
              <div className="form-grid" style={{ gridColumn: "1 / -1" }}>
                {[
                  { key: "qpay", label: "QPay" },
                  { key: "cards", label: "Банкны карт" },
                  { key: "cash", label: "Бэлэн мөнгө" },
                ].map((opt) => (
                  <label
                    key={opt.key}
                    className={`payment-option ${
                      payment === opt.key ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.key}
                      checked={payment === opt.key}
                      onChange={() => setPayment(opt.key)}
                      style={{ position: "absolute", opacity: 0 }}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                style={{ gridColumn: "1 / -1", marginTop: 16 }}
              >
                Төлбөр хийх
              </button>
            </form>
          </div>

          <div className="cart-summary-card">
            <h2 className="display">Захиалгын хураангуй</h2>
            {!mounted || items.length === 0 ? (
              <>
                <div className="summary-row">
                  <span>Сагс хоосон</span>
                  <span>—</span>
                </div>
                <Link
                  href="/shop"
                  className="btn btn-primary btn-full"
                  style={{ marginTop: 16 }}
                >
                  Дэлгүүр рүү буцах
                </Link>
              </>
            ) : (
              <>
                {items.map((item) => (
                  <div
                    className="summary-row"
                    key={`${item.id}-${item.optionLabel}`}
                  >
                    <span>
                      {item.title} x {item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
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
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
