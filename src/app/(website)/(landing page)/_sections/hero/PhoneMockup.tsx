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
     <AnimatePresence mode="wait">
        {curr === 0 ? (
          <motion.div
            key="image1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0,transition:{duration: 0.4} }}
            exit={{ opacity: 0, x: 10,transition:{duration: 0.2} }}
            className="absolute w-full h-full"
          >
            <Image
              quality={100}
              src="/image.png"
              fill
              alt="iphone mockup"
              className="object-contain lg:backdrop-blur-xs rounded-3xl overflow-hidden"
            />
          </motion.div>
        ) : (
          <motion.div
            key="image2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0,transition:{duration: 0.4} }}
            exit={{ opacity: 0, x: 10,transition:{duration: 0.2} }}
            className="absolute w-full h-full"
          >
            <Image
              quality={100}
              src="/Template 2.png"
              fill
              alt="iphone mockup"
              className="object-contain lg:backdrop-blur-xs rounded-3xl overflow-hidden"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
