import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

import React from "react";
import PhoneMockup from "./PhoneMockup";
import { MainButton } from "./MainButton";
import { getTranslations } from "next-intl/server";

export default async function Hero() {
  const t = await getTranslations("Hero");
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 grid-rows-2 xl:grid-rows-1 xl:mt-20 xl:h-[700px] mb-0 lg:mb-40">
      <div className="absolute top-0  left-0 -z-10  xl:w-full h-screen overflow-x-hidden w-screen backgroundMesh  ">
        {/* <div className="absolute top-0 xl:-top-48 left-0 -z-10 w-[1000px] lg:w-[1200px] xl:w-full h-auto aspect-video">
          <Image
            src={"/gradient-bg.png"}
            fill
            alt="gradient bg"
          />
        </div> */}
      </div>
      <div className="space-y-5 mt-10 sm:mt-0 3xl:mt-20">
        <h1 className=" font-bold  text-4xl md:text-6xl leading-tight ">
          {t("title")}
        </h1>
        <p className="text-xl md:text-4xl">{t("subtitle")}</p>
        {/* <Button
          variant={"outline"}
          asChild
          className="mt-8 text-xl  py-6 px-2 gap-10 justify-between "
        >
          <Link href={"/get-started"}>
            Get Started For Free{" "}
            <span className="size-10 bg-foreground rounded-md flex-center">
              {" "}
              <ArrowRight className="text-background size-8" />
            </span>{" "}
          </Link>
        </Button> */}
        <MainButton className="mt-5 3xl:mt-14 md:text-xl">
          <Link href={"/get-started"} className="flex gap-4 items-center size-full">
            {t("button")} <ArrowRight />
          </Link>
        </MainButton>
      </div>
      <div className=" relative max-md:left-1/2 max-md:-translate-x-1/2 h-full max-md:w-screen max-lg:overflow-x-hidden overflow-y-visible">
        <div className="absolute lg:top-36  xl:top-20 top-32 left-0 xl:left-20 bg-black/35 lg:bg-black/40 blur-3xl w-full lg:w-[150%] h-[50%] lg:h-[80%] xl:h-3/4 "></div>
        <div className=" absolute -right-60 top-20 xl:top-0 xl:-right-96 w-[520px] md:w-[650px] lg:w-[850px] xl:w-[1000px] h-auto aspect-video ">
          <Image
            quality={100}
            src={"/Menu items2.png"}
            fill
            alt="dasboard mockup"
            className="object-contain animate-float-slow  backdrop-blur-xs rounded-3xl overflow-hidden"
          />
        </div>
        <div className="  absolute -left-5 top-24 md:top-40 lg:top-32 lg:left-5 w-[200px] md:w-[200px] lg:w-[220px] lg:h-[450px] xl:w-[250px] h-[300px] xl:h-[500px]  ">
          {/* <Image
            quality={100}
            src={"/iPhone 16 2.png"}
            fill
            alt="iphone mockup"
            className="object-contain animate-float-slow delay-[2s]   backdrop-blur-xs rounded-3xl overflow-hidden"
          /> */}
          <PhoneMockup />
        </div>
      </div>
    </div>
  );
}
