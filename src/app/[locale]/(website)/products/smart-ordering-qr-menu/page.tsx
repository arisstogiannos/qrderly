import React from "react";
import ProductPage from "../_components/ProductPage";
import { productsData } from "@/data";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";

export const dynamic = "error";
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');

  const meta = t.raw('ordering') as {
    title: string;
    description: string;
    keywords: Record<string, string>;
    ogTitle: string;
    ogDescription: string;
    ogAlt: string;
  };

  return {
    title: meta.title,
    description: meta.description,
    keywords: Object.values(meta.keywords),
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: meta.ogAlt,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@yourTwitterHandle',
      title: meta.ogTitle,
      description: meta.ogDescription,
      images: ['/og-image.png'],
    },
  };
}

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
