import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

export default function page() {
  return (
    <section className="flex flex-col lg:min-w-xl max-w-7xl gap-y-6">
      <h1 className="text-2xl font-medium">Go Online</h1>
      <div className="grid grid-cols-1 grid-rows-2 xl:grid-rows-1 xl:grid-cols-2 text-lg">
        <div className="space-y-8  border-foreground xl:border-r-2 xl:pr-20 border-b-2 xl:border-b-0 pb-10 xl:pb-0">
          <p >
            Click publish ad we will generate a QR code for your clients to
            access the menu and one for your stuff to access the orders
            dashboard.
          </p>
          <div className="relative w-full lg:w-[400px] aspect-square h-auto">

          <Image src={"/menu-preview.png"} fill alt="menu-preview"/>
          </div>
        </div>
        <div className="space-y-8  xl:pl-20 pt-10 xl:pt-0">
          <p >
          You will be redirected to your dashboard to start adding products. Through the dashboard you can manage your menu and see analytics.
          </p>
          <div className="relative w-full lg:w-[530px] aspect-video lg:h-[330px]">

          <Image src={"/dashboard-preview.png"} fill alt="menu-preview"/>
          </div>
        </div>
      </div>
      <Button className="rounded-full ml-auto max-2xl:text-xl">Publish</Button>
    </section>
  );
}
