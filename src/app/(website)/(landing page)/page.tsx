import Hero from "./_sections/hero/Hero";
import HowItWorks from "./_sections/how-it-works/HowItWorks";
import Products from "./_sections/products/Products";
import WhoIsThisFor from "./_sections/WhoIsThisFor";
import ChooseUs from "./_sections/ChooseUs";
import Preview from "./_sections/preview/Preview";
import SomeFeatures from "./_sections/SomeFeatures";
import Testimonials from "./_sections/Testimonials";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <Hero />
      <ChooseUs/>
      <Products />
      <Suspense>

      <Preview/>
      </Suspense>
      <SomeFeatures/>
      <HowItWorks />
      <Testimonials/>
      {/* <WhoIsThisFor/> */}
    </>
  );
}
