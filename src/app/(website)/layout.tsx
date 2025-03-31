import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className=" font-[family-name:var(--font-instrument-sans)]  space-y-60 my-container max-sm:px-3 ">
        {children}
      </main>
      <Footer />
      <Toaster/>
    </>
  );
}
