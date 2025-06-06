import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import Banner from "@/components/Banner";
import ScrollToTop from "@/components/ScrollToTop";
import { getSale } from "../banner";
import Analytics from "@/components/Analytics";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const banner = await getSale();
  return (
    <>
      {banner && <Banner banner={banner} />}

      <Navbar />
      <main className=" font-[family-name:var(--font-instrument-sans)]  space-y-28 sm:space-y-40 my-container  ">
        {children}
      </main>
      <ScrollToTop />
      <Footer />
      <Toaster />
      <Analytics />
    </>
  );
}
