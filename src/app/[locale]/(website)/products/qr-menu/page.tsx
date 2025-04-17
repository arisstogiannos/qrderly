import React from "react";
import ProductPage from "../_components/ProductPage";
import { productsData } from "@/data";
import {setRequestLocale} from 'next-intl/server';
import { Metadata } from "next";

export const dynamic = "error"
export const metadata:Metadata = {
  title: "Create a QR Menu in Minutes | Smart & Contactless Menus",
  description:
    "Easily generate a custom QR menu for your business in under 5 minutes. Perfect for restaurants, cafés, and bars looking to offer contactless digital menus.",
  keywords: [
    "QR menu",
    "digital menu",
    "restaurant menu creator",
    "qr code menu generator",
    "contactless menu",
    "smart menu",
    "menu builder for restaurants"
  ],
  openGraph: {
    title: "Create a QR Menu in Minutes | Smart & Contactless Menus",
    description:
      "Launch your digital menu with a QR code in just 5 minutes. Ideal for cafés, restaurants, and hospitality businesses.",
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


export default async function page({params}:{params: Promise<{locale: string}>}) {
  const locale = (await params).locale;
  setRequestLocale(locale)
    const smMenu = {...productsData[0]}
    // smMenu.title = "QR Menu – Instant Access, Effortless Browsing"
  return (
    <ProductPage product={smMenu}/>
  );
}

