"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MainButton } from "./hero/MainButton";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function BusinessStats() {
  const [count, setCount] = useState(0);
  const t = useTranslations("Stats")
  const targetCount = 1200; // The final number to count up to
  const duration = 2000; // Duration of the animation in milliseconds
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    // Skip animation if we're not in the browser
    if (typeof window === "undefined") return;

    if (inView) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;

        if (elapsedTime >= duration) {
          setCount(targetCount);
          clearInterval(interval);
          return;
        }

        // Calculate the current count based on elapsed time
        const progress = elapsedTime / duration;
        const currentCount = Math.floor(progress * targetCount);
        setCount(currentCount);
      }, 16); // ~60fps

      return () => clearInterval(interval);
    }
  }, [inView]);

  return (
    <section
      ref={ref}
      className="py-10 sm:py-16 px-4 bg-foreground text-background rounded-4xl 2xl:mx-20 shadow-2xl shadow-black/50"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <div className="relative inline-block">
            <span className="text-7xl md:text-8xl font-extrabold tracking-tight">
              {count.toLocaleString()}
              <span className="text-primary">+</span>
            </span>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-primary"></div>
          </div>
          <p className="text-2xl md:text-3xl font-light mt-6 text-gray-300">
            Businesses Trust Our App
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <p className="text-xl text-gray-300 mb-12 text-center font-light">
            Our platform is the preferred solution for a diverse range of
            hospitality businesses:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              "Bars",
              "Restaurants",
              "Hotels",
              "Cafeterias",
              "Self-Service",
            ].map((business, index) => (
              <div key={business} className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 transform transition-transform duration-300 group-hover:scale-95 rounded-xl"></div>
                <div className="border border-white/10 bg-black/50 backdrop-blur-sm rounded-xl p-6 transition-all duration-300 group-hover:translate-y-[-4px] group-hover:shadow-lg group-hover:shadow-primary/20 relative z-10">
                  <p className="font-medium text-center text-lg text-nowrap">
                    {business}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <MainButton className="bg-primary mt-8 shadow-primary/30 hover:text-accent text-2xl">
              <Link href={"/get-started"} className="flex gap-3 items-center">
                Get Started Today <ArrowRight />
              </Link>
            </MainButton>
          </div>
        </div>
      </div>
    </section>
  );
}
