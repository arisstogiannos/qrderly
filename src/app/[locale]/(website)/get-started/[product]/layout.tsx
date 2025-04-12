import React, { ReactNode } from "react";
import Steps from "../_components/Steps";


export default async function layout({ children }: { children: ReactNode }) {

  return (
    <div className="mt-0 space-y-14">
      <Steps />
      <div className="border-4 border-accent rounded-3xl bg-background p-3 sm:p-8 w-fit min-h-[600px] mx-auto transition-all duration-1000 min-w-full lg:min-w-3xl">
        {children}
      </div>
    </div>
  );
}
