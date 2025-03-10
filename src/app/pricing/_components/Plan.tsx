"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { usePlanContext } from "./PlanContext";

type thisProps = {
  plan: { title: string; price: {yearly:string, monthly:string}; bullets: string[] };
};

export default function Plan({ plan }: thisProps) {
  const {selectedPlanType} = usePlanContext()
  return (
    <section className="bg-background border-2 border-primary/20 p-6 rounded-3xl flex flex-col gap-6 shadow-xl">
      <h2 className="font-medium text-3xl">{plan.title}</h2>
      <span className="text-3xl font-semibold">{plan.price[selectedPlanType || "yearly"]}</span>
      <ul className="space-y-2 text-lg mb-10">
        {plan.bullets.map((bullet) => (
          <li key={bullet} className="flex  gap-2 items-start">
            <span className="bg-foreground size-3 shrink-0 rounded-full mt-2" />
            {bullet}
          </li>
        ))}
      </ul>
      <div className=" flex flex-col gap-4 mt-auto">

      <Button className="rounded-full bg-foreground text-xl py-6" asChild><Link href={"/"}>Choose</Link></Button>
      <Button variant={"outline"} className="rounded-full  text-xl py-6" asChild><Link href={"/get-started/menu-settings"}>Free Trial</Link></Button>
      </div>
    </section>
  );
}
