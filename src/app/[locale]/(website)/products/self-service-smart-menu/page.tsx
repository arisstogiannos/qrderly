import React from "react";
import ProductPage from "../_components/ProductPage";
import { productsData } from "@/data";
import { setRequestLocale } from "next-intl/server";

export const dynamic = "error";

export const metadata = {
  title: "Self-Service Ordering Menu | Smart & Contactless Menus",
  description:
    "Empower your customers with self-service ordering. Let them scan, order, and enjoy—no waiters, no apps. Easy QR setup in minutes.",
  keywords: [
    "self-service ordering",
    "qr ordering system",
    "restaurant automation",
    "self-ordering menu",
    "digital self-service menu",
    "smart menu QR",
    "contactless restaurant tech",
  ],
  openGraph: {
    title: "Self-Service Ordering Menu | Smart & Contactless Menus",
    description:
      "Offer full self-service with our QR menu and ordering platform. Fast setup and seamless customer experience.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "QR Ordering App Screenshot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default async function page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale;
  setRequestLocale(locale);
  const smMenu = { ...productsData[2] };
  // smMenu.title = "QR Menu – Instant Access, Effortless Browsing"
  return <ProductPage product={smMenu} />;
}
