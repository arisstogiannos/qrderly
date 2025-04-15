"use client";
import React, { useState } from "react";
import CountdownTimer from "./Counter";
import { Banner as bannertype } from "@prisma/client";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Banner({banner}:{banner:bannertype}) {
  const [hidden, setHidden] = useState(false);
  const t = useTranslations("banner")


  return hidden ? null : (
    <div className="w-screen  bg-foreground inset-0 sticky text-background -top-32 md:-top-20  ">
      <div className="my-container flex flex-col md:py-1 py-2 sm:flex-row justify-between items-center 2xl:pr-10 3xl:pr-0">
        <span>
          {t("title")}
          <span className="max-md:hidden">
            {t.rich("subtitle", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
            
            
          </span>
        </span>
        <CountdownTimer onTimerEnd={ setHidden} targetDate={banner.targetTime} />
      </div>
    <X className="absolute top-4 right-3 md:right-10 cursor-pointer hover:text-red-700 transition-colors" onClick={()=>setHidden(true)}/>
    </div>
  );
}
