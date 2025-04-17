import React from "react";
import ProductPage from "../_components/ProductPage";
import { productsData } from "@/data";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Smart QR Menu with Ordering System | Easy Setup in 5 Min",
  description:
    "Combine your QR menu with a smart ordering system. Customers can scan, browse, and order — all from their phones. No apps, no fuss.",
  keywords: [
    "smart ordering system",
    "QR menu with ordering",
    "digital ordering",
    "ordering QR",
    "Qr menu generator",
    "contactless ordering",
    "qr menu ordering system",
  ],
  openGraph: {
    title: "Smart QR Menu with Ordering System | Easy Setup in 5 Minutes",
    description:
      "Create a digital menu with built-in ordering in minutes. Streamline your business service with our smart QR menu system.",
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

  // openGraph: {
  //   title: "QR Ordering App - Order Food Seamlessly",
  //   description: "Transform your restaurant experience with QR-based ordering. Browse, order, and pay effortlessly.",
  //   url: "https://your-qr-ordering-app.com",
  //   siteName: "QR Ordering App",
  //   images: [
  //     {
  //       url: "/og-image.jpg",
  //       width: 1200,
  //       height: 630,
  //       alt: "QR Ordering App Screenshot",
  //     },
  //   ],
  //   locale: "en_US",
  //   type: "website",
  // },
  // twitter: {
  //   card: "summary_large_image",
  //   site: "@yourTwitterHandle",
  //   title: "QR Ordering App - Contactless Food Ordering",
  //   description: "Scan, order, and enjoy a seamless dining experience.",
  //   images: ["/twitter-card.jpg"],
  // },
};

export default async function page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale;
  setRequestLocale(locale);
  const smMenu = { ...productsData[1] };
  // smMenu.title = "Smart QR Menu – Seamless & Effortless Ordering"
  return <ProductPage product={smMenu} />;
}
