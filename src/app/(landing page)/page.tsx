import { SessionProvider } from "next-auth/react";
import Hero from "./_sections/hero/Hero";
import HowItWorks from "./_sections/how-it-works/HowItWorks";
import Products from "./_sections/products/Products";
import WhoIsThisFor from "./_sections/WhoIsThisFor";

export default function Home() {
  return (
    <SessionProvider>
      <Hero />
      <Products />
      <HowItWorks />
      <WhoIsThisFor/>
    </SessionProvider>
  );
}
