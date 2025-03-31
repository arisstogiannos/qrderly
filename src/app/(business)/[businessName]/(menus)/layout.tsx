import React, { ReactNode } from "react";
import MenuFooter from "@/components/MenuFooter";
import { Toaster } from "@/components/ui/sonner";


export default async function layout({ children }: { children: ReactNode }) {


  return (
     <div className="bg-background text-foreground">
          <>{children}</>
          <Toaster
                position="bottom-right"
                toastOptions={{ duration: 2000 }}
                
              />
          <MenuFooter />
        </div>
  );
}
