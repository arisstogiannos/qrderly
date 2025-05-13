import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import Providers from "../context/Providers";
import type { Metadata } from 'next';
import { getTranslations } from "next-intl/server";
import {setRequestLocale} from 'next-intl/server';
import Script from 'next/script';
import Head from "next/head";


const instrumentsSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  const meta = t.raw('main') as {
    title: string;
    description: string;
    keywords: Record<string, string>;
    ogTitle: string;
    ogDescription: string;
    ogAlt: string;
    twitterTitle: string;
    twitterDescription: string;
  };

  return {
    metadataBase: new URL('https://www.scanby.cloud/'),
    title: meta.title,
    description: meta.description,
    keywords: Object.values(meta.keywords),
    authors: [{ name: 'Aris Stogiannos', url: 'https://aris-stogiannos.gr' }],
    icons: {
      icon: '/favicon.ico',
    },
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: 'https://www.scanby.cloud/',
      siteName: 'Scanby',
      images: [
        {
          url: '/opengraph-image.png',
          secureUrl:'/opengraph-image.png',
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
      title: meta.twitterTitle,
      description: meta.twitterDescription,
      images: ['/opengraph-image.png'],
    },
  };
}
export const dynamicParams = true; // or false, to 404 on unknown paths
// export const revalidate = 60

export async function generateStaticParams() {
  return [
    {
      locale: "en",
    },
    { locale: "el" },
  ];
}


export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <Head>

      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1381198616255403');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img 
          height="1" 
          width="1" 
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=1381198616255403&ev=PageView&noscript=1"
          alt="Facebook Pixel"
        />
      </noscript>
          </Head>
      <body
        className={`${instrumentsSans.variable} antialiased font-[family-name:var(--font-instrument-sans)]     bg-background overflow-x-hidden selection:bg-accent selection:text-primary`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
