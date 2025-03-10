import React, { ReactNode } from "react";
import Steps from "../_components/Steps";


export default async function layout({ children }: { children: ReactNode }) {
  // const msg = await isAllowed()
  // if(msg){
  //   return <div className="h-screen">{msg}</div>
  // }
  return (
    <div className="mt-0 space-y-14">
      <Steps />
      <div className="border-4 border-accent rounded-3xl bg-background p-8 w-fit mx-auto transition-all duration-1000">
        {children}
      </div>
    </div>
  );
}
