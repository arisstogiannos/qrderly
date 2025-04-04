import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import Banner from "@/components/Banner";
import { db } from "@/db";
import ScrollToTop from "@/components/ScrollToTop";

export  default async function Layout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}){
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const banner = await  db.banner.findFirst()
  return (
    <>
    <NextIntlClientProvider>
      {banner&&<Banner banner={banner}/>}

      <Navbar />
      <main className=" font-[family-name:var(--font-instrument-sans)]  space-y-60 my-container  ">
        {children}
      </main>
      <ScrollToTop/>
      <Footer />
      <Toaster/>
    </NextIntlClientProvider>
    </>
  );
}
