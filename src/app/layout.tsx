import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import Providers from "../context/Providers";

const instrumentsSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Smart QR Menu & Ordering System",
  description:
  "Set up a digital QR menu in under 5 minutes. Upload a PDF or image and instantly generate a menu where your customers can scan and even order from. Get started for free - No Credit Card Required",
  keywords: [
    "QR menu",
    "digital menu",
    "smart ordering",
    "self-service menu",
    "self-service ordering system",
    "ordering system",
    "QR menu with ordering system",
    "AI menu generator",
    "5-minute menu setup",
    "QR code menu",
    "contactless ordering system",
    "online menu creatoor"
  ],
  authors: [{ name: "Aris Stogiannos", url: "https://aris-stogiannos.gr" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "QR Ordering App - Browse & Order Seamlessly",
    description: "Transform your business customer experience with QR Menus with built-in Ordering System option.",
    url: "https://scanby.cloud",
    siteName: "Scanby",
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
  twitter: {
    card: "summary_large_image",
    site: "@yourTwitterHandle",
    title: "QR Ordering App - Contactless Food Ordering",
    description: "Scan, order, and enjoy a seamless dining experience.",
    images: ["/og-image.png"],
  },
};
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

  return (
    <html lang={locale}>
      <body
        className={`${instrumentsSans.variable} antialiased font-[family-name:var(--font-instrument-sans)]     bg-background overflow-x-hidden selection:bg-accent selection:text-primary`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
