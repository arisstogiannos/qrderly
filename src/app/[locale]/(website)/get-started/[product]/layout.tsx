import React, { ReactNode } from "react";
import Steps from "../_components/Steps";


export default async function layout({ children }: { children: ReactNode }) {

  return (
    <div className="mt-0 space-y-10">
      <Steps />
      <div className="border-4 border-accent rounded-3xl bg-background p-3  sm:p-8 w-fit min-h-[600px] mx-auto relative transition-all duration-1000 min-w-full lg:min-w-3xl shadow-lg">
        <div className="absolute -left-0 -top-0  blur-3xl -z-10 size-80 bg-radial from-primary/50 to-background"  />
        <div className="absolute right-0 top-30  blur-3xl -z-10 size-80 bg-radial from-purple-800/50 to-background"  />
        <div className="absolute -left-10 bottom-30  blur-3xl -z-10 size-80 bg-radial from-purple-600/50 to-background"  />
        <div className="absolute inset-x-0 bottom-0  blur-3xl -z-10 w-[120%] h-80 bg-radial from-cyan-500/50 to-background"  />
        {children}
      </div>
    </div>
  );
}
