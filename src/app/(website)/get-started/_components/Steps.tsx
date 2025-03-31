"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";

export default function Steps() {
  const steps = [
    "business setup",
    "menu settings",
    "generate items",
    "customize qr",
    "publish",
  ];
  const pathname = usePathname();
  const container = useRef<HTMLDivElement[]>([]);
  const ar = pathname.split("/");
  const currStep = ar.pop();

  const currIndex = steps.findIndex(
    (step) => step.replace(" ", "-") === currStep
  );

  useEffect(() => {
    if (container.current[currIndex]) {
      container.current[currIndex].scrollIntoView({ block: "center" });
    }
  }, [currIndex]);

  return (
    <div className=" relative w-full md:w-fit h-fit mx-auto  max-md:overflow-auto scrollbar-hidden bg-gradient-to-r from-0% from-background/40 via-50% via-transparent to-100% to-background/40">
      <div className="relative w-fit h-full flex gap-14 sm:gap-20 items-end">

      <hr className="absolute w-[90%] left-[53%] -translate-x-1/2 top-3/4  lg:top-2/3 border-foreground border-2 -z-10 opacity-20" />
      <hr
        style={{
          transform: `scaleX(${
            currIndex >= 0 ? currIndex / (steps.length - 1) : 0
          })`,
        }}
        className={`absolute w-[90%] left-[53%] -translate-x-1/2 top-3/4 lg:top-2/3 border-foreground border-2 -z-10 origin-left transition-all duration-1000 ease-out`}
        />
      {steps.map((step, i) => (
        <div
        ref={(el) => {
          if (el) {
            container.current[i] = el;
          }
        }}
        id={step}
        key={i}
        className={`flex flex-col items-center gap-1 pointer-events-none `}
        >
          <p className="text-sm text-center sm:text-lg capitalize">{step}</p>
          <span
            className={`flex-center size-8 rounded-full border-2 border-foreground transition-all duration-1000 ${
              currIndex >= i
              ? "bg-foreground text-background delay-700"
              : "bg-background text-foreground"
            }`}
            >
            {i + 1}
          </span>
        </div>
      ))}
      </div>
    </div>
  );
}