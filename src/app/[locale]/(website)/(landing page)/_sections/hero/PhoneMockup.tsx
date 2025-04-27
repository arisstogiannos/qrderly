"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function PhoneMockup() {
  const [curr, setCurr] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurr((prev) => (prev + 1) % 2);
    }, 3000);

    return () => clearInterval(interval);
  }, [curr, setCurr]);
  return (
    <div className="">
     <AnimatePresence mode="popLayout">
        {curr === 0 ? (
          <motion.div
            key="image1"
            initial={{ opacity: 0.5, filter: "blur(20px)"}}
            animate={{ opacity: 1, filter: "blur(0px)",transition:{duration: 0.5} }}
            exit={{ opacity: 0,  filter: "blur(20px)",transition:{duration: 0.3} }}
            className="absolute w-full h-full"
          >
            <Image
              quality={100}
              src="/image.png"
              fill
              priority
              alt="iphone mockup"
              className="object-contain lg:backdrop-blur-xs rounded-3xl overflow-hidden"
            />
          </motion.div>
        ) : (
          <motion.div
            key="image2"
            initial={{ opacity: 0.5, filter: "blur(20px)"}}
            animate={{ opacity: 1, filter: "blur(0px)",transition:{duration: 0.5} }}
            exit={{ opacity: 0,  filter: "blur(20px)",transition:{duration: 0.3} }}
            className="absolute w-full h-full"
          >
            <Image
              quality={100}
              src="/Template 2.png"
              fill
              priority
              alt="iphone mockup"
              className="object-contain lg:backdrop-blur-xs rounded-3xl overflow-hidden"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
