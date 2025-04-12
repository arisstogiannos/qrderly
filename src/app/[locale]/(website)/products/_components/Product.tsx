import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {Link} from "@/i18n/navigation";

import React from "react";

type thisProps = {
  title: string;
  desc: string;
  steps: string[];
  videoPath: string;
};

export default function Product({ title, desc, steps, videoPath }: thisProps) {
  return (
    <div
      id={title.replaceAll(" ", "-")}
      className="grid grid-cols-1 grid-rows-[auto_auto] xl:grid-cols-2 gap-6 md:gap-16 xl:gap-20"
    >
      <div className="space-y-10">
        <div className="space-y-2">
          <h2 className=" text-3xl md:text-4xl xl:text-3xl font-medium">
            {title}
          </h2>
          <p className="text-base md:text-2xl xl:text-xl">{desc}</p>
        </div>
        <div className="space-y-4">
          <h3 className="font-medium text-4xl md:text-3xl xl:text-2xl">
            How it works
          </h3>
          <ul className="space-y-4">
            {steps.map((step, i) => {
              const [stepTitle, stepDesc] = step.split("-");
              return (
                <li className="font-medium flex gap-5 items-start" key={i}>
                  <span className="flex-center size-3 p-3 md:size-8 md:p-4 bg-foreground text-background rounded-full text-sm md:text-lg mt-1 sm:mt-0">
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-y-1">
                    <p className="text-lg md:text-2xl  xl:text-xl">
                      {stepTitle}
                    </p>
                    <p className="text-base md:text-xl  xl:text-base font-normal text-balance">
                      {stepDesc}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="space-x-10 space-y-5">
          <Button
            className="text-lg md:text-2xl xl:text-xl rounded-full p-6 px-10 gap-x-4"
            asChild
          >
            <Link  href={"/get-started/"+title.replaceAll(" ","-").toLowerCase()+"/business-setup"}>
              Get Started for Free <ArrowRight className="size-6" />
            </Link>
          </Button>
          <Button
            variant={"outline"}
            asChild
            className="text-lg md:text-2xl xl:text-xl py-5 md:py-6 pl-4 pr-2 gap-5 md:gap-20 justify-between rounded-full"
          >
            <Link href={"/products/"+title.toLowerCase().replaceAll(" ","-")}>
              Learn More
              <span className="h-8 md:h-10 w-12 md:w-16 bg-foreground rounded-full flex-center">
                <ArrowRight className="text-background size-6 md:size-8" />
              </span>
            </Link>
          </Button>
        </div>
      </div>
      <div className="h-[330px] md:h-full  pt-10">
        <video
          preload="auto"
          loop
          autoPlay
          playsInline
          muted
          className="object-cover h-full rounded-3xl"
          src={videoPath}
        ></video>
      </div>
    </div>
  );
}
