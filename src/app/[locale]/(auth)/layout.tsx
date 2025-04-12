import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="absolute top-0  left-0 -z-10  xl:w-full h-screen overflow-x-hidden w-screen">
        <div className="absolute top-0 xl:-top-48 left-0 -z-10 w-[1000px] lg:w-[1200px] xl:w-full h-auto aspect-video backgroundMesh"/>
      </div>
      <section className="flex  w-full items-center justify-center md:p-10 h-screen">
        <Button asChild className="top-5 left-5 absolute bg-foreground text-background rounded-full"><Link href={"/"}><ArrowLeft/>Back To Homepage</Link></Button>
        <div className="w-full max-w-lg px-2">{children}</div>
      </section>
    </div>
  );
}
