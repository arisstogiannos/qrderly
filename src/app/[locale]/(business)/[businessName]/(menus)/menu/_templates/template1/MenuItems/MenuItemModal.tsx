"use client";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { ReactNode } from "react";
import CloudImage from "@/components/CloudImage";
import { useCardModalContext } from "@/context/CardModalProvider";
import { MenuItemRequired } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function MenuItemModal({
  children,
  menuItem,
}: {
  children: ReactNode;
  menuItem: MenuItemRequired;
}) {
  const { open, setOpen } = useCardModalContext();
  const isMobile = useIsMobile()

  if(isMobile)
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="overflow-hidden rounded-t-3xl border-0 bg-secondary text-foreground">
        <div className="scrollbar-hidden max-h-[90vh]  overflow-y-auto pb-20 min-[350px]:max-h-[80vh] relative">
          <div className="relative aspect-video h-auto w-full overflow-hidden rounded-lg">
            <CloudImage
              src={menuItem.imagePath ?? ""}
              fill
              className="inset-0 w-screen object-cover"
              alt={menuItem.name}
            />
            {/* <DrawerClose   className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-background">
              <ChevronDown onClick={()=>setOpen(false)} size={"30px"} />
            </DrawerClose> */}
          </div>

          <div className=" px-4 pb-4 relative">{children}</div>
        </div>
      </DrawerContent>
    </Drawer>
  );

  return(
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="overflow-hidden rounded-t-3xl border-0 bg-secondary text-foreground focus:outline-none"
>
      <div className="scrollbar-hidden max-h-[90vh]  overflow-y-auto pb-20 min-[350px]:max-h-[80vh] relative">
        <div className="relative aspect-video h-auto w-full overflow-hidden rounded-lg">
          <CloudImage
            src={menuItem.imagePath ?? ""}
            fill
            className="inset-0 w-screen object-cover"
            alt={menuItem.name}
          />
            <X onClick={()=>setOpen(false)} size={"30px"} className="absolute right-4 top-4 flex size-10 items-center cursor-pointer justify-center rounded-full bg-background"/>
        </div>

        <div className=" px-4 pb-4 relative">{children}</div>
      </div>
    </DialogContent>
  </Dialog>
  )
}

export function ModalTrigger({ children }: { children: ReactNode }) {
  const { setOpen } = useCardModalContext();
  return (
    <div onClick={() => setOpen(true)} className="cursor-pointer">
      {children}
    </div>
  );
}
