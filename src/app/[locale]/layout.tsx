import type { Metadata } from 'next';
import { Instrument_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import GoogleTagManager from '@/components/GoogleTagManager';
import Providers from '@/context/Providers';

const instrumentsSans = Instrument_Sans({
  variable: '--font-instrument-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
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
          secureUrl: '/opengraph-image.png',
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
// export const dynamicParams = true; // or false, to 404 on unknown paths
// export const revalidate = 60
export async function generateStaticParams() {
  return [
    {
      locale: 'en',
    },
    { locale: 'el' },
  ];
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const locale = (await params).locale;
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <head>
        <Suspense fallback={null}>
          <GoogleTagManager />
        </Suspense>
      </head>
      <body
        className={`${instrumentsSans.variable} antialiased font-[family-name:var(--font-instrument-sans)]     bg-background overflow-x-hidden selection:bg-accent selection:text-primary`}
      >
        <NextIntlClientProvider>
          <Providers>
            <Suspense fallback={null}>{children}</Suspense>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
