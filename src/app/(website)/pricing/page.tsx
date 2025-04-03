import React from "react";
import { Switch } from "./_components/Switch";
import { plandata } from "@/data";
import Plan from "./_components/Plan";
import { PlanProvider } from "./_components/PlanContext";
import { auth } from "@/auth";

export  default async function Page() {
  const user = (await auth())?.user
  return (
    <PlanProvider>
      <div className="flex flex-col gap-10 items-center w-full mt-10">
        <div className=" w-screen fixed h-screen top-0 -z-50">

        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 blur-3xl w-[1000px] h-auto aspect-video bg-radial from-primary/60 to-primary/0 rounded-full -z-10" />
        </div>

        <header className="mx-auto space-y-6">
          <h2 className="capitalize text-5xl md:text-7xl font-medium mx-auto text-center">choose Product</h2>
          <Switch />
        </header>
        <section className="grid grid-rows-3 grid-cols-1 xl:grid-rows-1 xl:grid-cols-3 2xl:mx-40 gap-10">
          {plandata.map((plan) => (
            <Plan key={plan.title} plan={plan} user={user} />
          ))}
        </section>
      </div>
    </PlanProvider>
  );
}