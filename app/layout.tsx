import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "HushKhan.mn — Монголын хушны самрын premium брэнд",
  description: "HushKhan — Монголын хушны самрын premium брэнд. Байгалийн амт, олон улсын чанар.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
