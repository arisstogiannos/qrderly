import Hero from "./_sections/hero/Hero";
import HowItWorks from "./_sections/how-it-works/HowItWorks";
import Products from "./_sections/products/Products";
import WhoIsThisFor from "./_sections/WhoIsThisFor";
import ChooseUs from "./_sections/ChooseUs";
import Preview from "./_sections/preview/Preview";
import SomeFeatures from "./_sections/SomeFeatures";
import Testimonials from "./_sections/Testimonials";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import BusinessStats from "./_sections/BusinessStats";

export default async function IndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <ChooseUs />
      <Products />
      <Suspense>
      <Preview />
      </Suspense>
      <SomeFeatures />
      <HowItWorks />
      {/* <BusinessStats/> */}
      {/* <Testimonials /> */}
      {/* <WhoIsThisFor/> */}
    </>
  );
}
