import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="absolute top-0  left-0 -z-10  xl:w-full h-screen overflow-x-hidden w-screen">
        <div className="absolute top-0 xl:-top-48 left-0 -z-10 w-[1000px] lg:w-[1200px] xl:w-full h-auto aspect-video backgroundMesh"></div>
      </div>
      <div className="flex  w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-lg mt-20">{children}</div>
      </div>
    </div>
  );
}
