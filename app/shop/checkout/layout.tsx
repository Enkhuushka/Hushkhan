import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Төлбөр — HushKhan.mn",
  description: "HushKhan захиалга баталгаажуулах, төлбөр.",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
