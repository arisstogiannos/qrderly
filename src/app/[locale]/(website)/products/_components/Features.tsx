"use client";
import { FeatureType } from "@/types";
import { AnimatePresence, useInView, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React, { ReactNode, useEffect, useRef, useState } from "react";

export default function Features({ features }: { features: FeatureType[] }) {
  const [videoSrc, setVideoSrc] = useState<string>(features[0].video);
  return (
    <div className="grid xl:grid-cols-2">
      <div className="xl:space-y-[500px] space-y-20 xl:pr-20">
        {features.map((f) => (
          <Feature setVideo={setVideoSrc} key={f.title} {...f} />
        ))}
      </div>
      <Video src={videoSrc} />
    </div>
  );
}

function Feature({
  icon,
  title,
  video,
  desc,
  setVideo,
}: FeatureType & { setVideo: (v: string) => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-400px" });
  const t = useTranslations("productsData.features")

  useEffect(() => {
    if (isInView) {
      setVideo(video);
    }
  }, [isInView]);

  return (
    <div ref={ref} className="space-y-5 text-background">
      <div  className="flex gap-4 2xl:max-w-2xl xl:last-of-type:mb-60 ">
        <span className="bg-foreground size-10 lg:size-14 flex-center p-2 min-w-10 lg:min-w-14 md:mt-1 rounded-full text-primary ">
          {icon}
        </span>
        <div className="space-y-1 sm:space-y-2 text-balance">
          <h3 className="font-medium text-2xl md:text-5xl mix-blend-difference">{t(title+".title")}</h3>
          <p className="text-lg md:text-2xl mix-blend-difference font-normal">{t(title+".desc")}</p>
        </div>
      </div>
      <video
        autoPlay
        muted
        playsInline
        loop
        className="xl:hidden  "
        src={video}
      />
    </div>
  );
}
function Video({ src }: { src: string }) {
  return (
    <div className="w-full h-auto aspect-video sticky top-36 3xl:top-60 rounded-3xl xl:block hidden">
      <AnimatePresence mode="popLayout">
        <motion.video
          key={src}
          animate={{ scale: 1, opacity: 1 }}
          initial={{ scale: 0.9, opacity: 0 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          autoPlay
          muted
          playsInline
          loop
          src={src}
          className="object-fill"
        ></motion.video>
      </AnimatePresence>
    </div>
  );
}
