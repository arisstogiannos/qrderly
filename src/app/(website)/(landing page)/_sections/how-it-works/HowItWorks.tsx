import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const steps = [
  "create a free account",
  "choose a product",
  "setup your bussiness profile",
  "create and personalize your menu",
  "your menu is online! Your customers can scan the qr code we generated for you or visit your link.",
];

export default function HowItWorks() {
  return (
    <section className="grid xl:grid-cols-2 grid-rows-[auto_auto] grid-cols-1 xl:grid-rows-1 font-medium capitalize">
      <div className="space-y-6 md:space-y-12 lg:space-y-8 max-xl:border-b xl:border-r border-foreground lg:pr-28 pb-14 xl:pb-0">
        <h2 className="text-5xl md:text-8xl ">how to set up your qR menu</h2>
        <p className="text-xl md:text-4xl ">
          Follow these 5 steps and your online menu will be set in minutes
        </p>
        <div className="md:gap-x-8 flex max-md:justify-between ">
          <Button
            className=" md:text-2xl p-5 md:p-7 rounded-full bg-foreground text-sm"
            asChild
          >
            <Link href={"/get-started"}>Get Started for free</Link>
          </Button>
          <Button
            variant={"outline"}
            asChild
            className="text-sm  md:text-2xl py-5 md:py-7 pl-4 pr-2 gap-5 md:gap-20 justify-between rounded-full"
          >
            <Link href={"/"}>
              Learn More
              <span className="h-8 md:h-10 w-12 md:w-16 bg-foreground rounded-full flex-center">
                <ArrowRight className="text-background size-6 md:size-8" />
              </span>
            </Link>
          </Button>
        </div>
      </div>
      <ul className=" space-y-5 lg:space-y-8 xl:pl-28 pt-14 xl:pt-0 md:pr-20 lg:pr-0">
        {steps.map((step, i) => (
          <li className="font-medium flex gap-5 items-start" key={i}>
            <span className="flex-center size-8 p-5 md:size-10 md:p-6 bg-foreground text-background rounded-full text-lg md:text-2xl">
              {i + 1}
            </span>
            <p className="text-lg md:text-3xl mt-1 xl:text-2xl">{step}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
