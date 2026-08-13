import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Сагс — HushKhan.mn",
  description: "HushKhan онлайн дэлгүүрийн сагс.",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
