import React from "react";
import ProductPage from "../_components/ProductPage";
import { productsData } from "@/data";
import {getTranslations, setRequestLocale} from 'next-intl/server';
import { Metadata } from "next";

export const dynamic = "error";
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');

  const meta = t.raw('qrMenu') as {
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

export default async function page({params}:{params: Promise<{locale: string}>}) {
  const locale = (await params).locale;
  setRequestLocale(locale)
    const smMenu = {...productsData[0]}
    // smMenu.title = "QR Menu – Instant Access, Effortless Browsing"
  return (
    <ProductPage product={smMenu}/>
  );
}

