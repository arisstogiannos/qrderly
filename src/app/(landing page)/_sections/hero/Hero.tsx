import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Hero() {

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 grid-rows-2 xl:grid-rows-1 xl:mt-20 xl:h-[700px]">
      <div className="absolute top-0  left-0 -z-10  xl:w-full h-screen overflow-x-hidden w-screen backgroundMesh  ">
        {/* <div className="absolute top-0 xl:-top-48 left-0 -z-10 w-[1000px] lg:w-[1200px] xl:w-full h-auto aspect-video">
          <Image
            src={"/gradient-bg.png"}
            fill
            alt="gradient bg"
          />
        </div> */}
      </div>
      <div className="space-y-5 mt-20">
        <h1 className=" font-bold  text-4xl md:text-6xl leading-tight ">
          Transform Your Bussiness with Smart QR Menus & Online Ordering
        </h1>
        <p className="text-xl md:text-4xl">
          A complete digital solution for restaurants, bars, and cafeterias in
          Greece. Let your customers order effortlessly via QR code or online.
        </p>
        <Button
          variant={"outline"}
          asChild
          className="mt-8 text-xl  py-6 px-2 gap-10 justify-between "
        >
          <Link href={"/"}>
            Get Started For Free{" "}
            <span className="size-10 bg-foreground rounded-md flex-center">
              {" "}
              <ArrowRight className="text-background size-8" />
            </span>{" "}
          </Link>
        </Button>
      </div>
      <div className=" relative h-full w-full">
        <div className="absolute lg:top-36  xl:top-20 top-0 left-0 xl:left-20 bg-black/30 lg:bg-black/40 blur-3xl w-full lg:w-[150%] h-2/3 lg:h-full xl:h-3/4 "></div>
        <div className=" absolute right-0 top-20 xl:top-0 xl:-right-96 w-[320px] md:w-[650px] lg:w-[850px] xl:w-[1000px] h-auto aspect-video ">
          <Image
            src={"/Dashboard.png"}
            fill
            alt="dasboard mockup"
            className="object-contain animate-float-slow"
          />
        </div>
        <div className="  absolute left-0 top-20 md:top-40 lg:top-32 lg:left-5 w-[100px] md:w-[200px] lg:w-[220px] lg:h-[450px] xl:w-[250px] h-[300px] xl:h-[500px]  ">
          <Image
            src={"/iPhone.png"}
            fill
            alt="iphone mockup"
            className="object-contain animate-float-slow delay-[2s] "
          />
        </div>
      </div>
    </div>
  );
}
