import dynamic from 'next/dynamic';
import { setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import Hero from './_sections/hero/Hero';

// Dynamically import components
const ChooseUs = dynamic(() => import('./_sections/ChooseUs'), {
  loading: () => <div className="min-h-[400px] flex items-center justify-center" />,
});
const Products = dynamic(() => import('./_sections/products/Products'), {
  loading: () => <div className="min-h-[400px] flex items-center justify-center" />,
});
const Preview = dynamic(() => import('./_sections/preview/Preview'), {
  loading: () => <div className="min-h-[400px] flex items-center justify-center" />,
});
const SomeFeatures = dynamic(() => import('./_sections/SomeFeatures'), {
  loading: () => <div className="min-h-[400px] flex items-center justify-center" />,
});
const HowItWorks = dynamic(() => import('./_sections/how-it-works/HowItWorks'), {
  loading: () => <div className="min-h-[400px] flex items-center justify-center" />,
});
const BusinessStats = dynamic(() => import('./_sections/BusinessStats'), {
  loading: () => <div className="min-h-[400px] flex items-center justify-center" />,
});
const OrderMenu = dynamic(() => import('./_sections/order-menu/OrderMenu'), {
  loading: () => <div className="min-h-[400px] flex items-center justify-center" />,
});

export default async function IndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Suspense
        fallback={<div className="min-h-[400px] flex items-center justify-center">Loading...</div>}
      >
        <ChooseUs />
      </Suspense>
      <Suspense
        fallback={<div className="min-h-[400px] flex items-center justify-center">Loading...</div>}
      >
        <Products />
      </Suspense>
      <Suspense
        fallback={<div className="min-h-[400px] flex items-center justify-center">Loading...</div>}
      >
        <Preview />
      </Suspense>
      <Suspense
        fallback={<div className="min-h-[400px] flex items-center justify-center">Loading...</div>}
      >
        <SomeFeatures />
      </Suspense>
      <Suspense
        fallback={<div className="min-h-[400px] flex items-center justify-center">Loading...</div>}
      >
        <HowItWorks />
      </Suspense>
      <Suspense
        fallback={<div className="min-h-[400px] flex items-center justify-center">Loading...</div>}
      >
        <BusinessStats />
      </Suspense>
      <Suspense
        fallback={<div className="min-h-[400px] flex items-center justify-center">Loading...</div>}
      >
        <OrderMenu />
      </Suspense>
      {/* <Testimonials /> */}
      {/* <WhoIsThisFor/> */}
    </>
  );
}
