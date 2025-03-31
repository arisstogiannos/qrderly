import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
    <Suspense>

      <Navbar  />
    </Suspense>
      <main className=" font-[family-name:var(--font-instrument-sans)]  space-y-60 my-container max-sm:px-3 ">
        {children}
      </main>
      <Footer />
      <Toaster/>
    </SessionProvider>
  );
}
