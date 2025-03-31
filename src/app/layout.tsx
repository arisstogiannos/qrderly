import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import Providers from "../context/Providers";

const instrumentsSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "QR Ordering App - Seamless Contactless Orders",
  description: "Scan QR codes to browse menus, place orders, and pay—all from your phone. A modern, fast, and seamless restaurant ordering experience.",
  keywords: ["QR ordering", "contactless ordering", "restaurant menu", "food ordering", "online payment"],
  authors: [{ name: "Aris Stogiannos", url: "https://aris-stogiannos.gr" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentsSans.variable} antialiased font-[family-name:var(--font-instrument-sans)]     bg-background overflow-x-hidden`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
