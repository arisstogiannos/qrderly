"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { ReactNode } from "react";
import CloudImage from "@/components/CloudImage";
import { useCardModalContext } from "@/context/CardModalProvider";
import MenuItemOptionsForm from "./MenuItemForm";
import type { MenuItemRequired } from "@/types";
import DisplayPrice from "@/components/DisplayPrice";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function MenuItemModal({
  menuItem,
  withImage,
}: {
  menuItem: MenuItemRequired;
  withImage: boolean;
}) {
  const { open, setOpen } = useCardModalContext();
  const isMobile = useIsMobile();

  if (isMobile)
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="overflow-hidden rounded-t-3xl border-0 bg-background text-foreground">
          <div className="scrollbar-hidden max-h-[90vh]  overflow-y-auto pb-20 min-[350px]:max-h-[80vh] relative">
            {withImage && menuItem.imagePath && (
              <div className="relative aspect-video h-auto w-full overflow-hidden rounded-lg">
                <CloudImage
                  src={menuItem.imagePath}
                  fill
                  className="inset-0 w-screen object-cover"
                  alt={menuItem.name}
                />
                {/* <DrawerClose   className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-background">
              <ChevronDown onClick={()=>setOpen(false)} size={"30px"} />
            </DrawerClose> */}
              </div>
            )}

            <div className=" px-4 pb-4 relative">
              <MenuItemModalHeader menuItem={menuItem} />
              <MenuItemOptionsForm menuItem={menuItem} setOpen={setOpen} />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden  border-0 bg-background text-foreground focus:outline-none p-0">
        <div className="scrollbar-hidden max-h-[90vh]  overflow-y-auto pb-20 min-[350px]:max-h-[80vh] relative">
          <div className="scrollbar-hidden max-h-[90vh]  overflow-y-auto pb-20 min-[350px]:max-h-[80vh] relative">
            {withImage && menuItem.imagePath && (
              <div className="relative aspect-video h-auto w-full overflow-hidden rounded-lg">
                <CloudImage
                  src={menuItem.imagePath}
                  fill
                  className="inset-0 w-screen object-cover"
                  alt={menuItem.name}
                />
                {/* <DrawerClose   className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-background">
              <ChevronDown onClick={()=>setOpen(false)} size={"30px"} />
            </DrawerClose> */}
              </div>
            )}

            <div className=" px-4 pb-4 relative">
              <MenuItemModalHeader menuItem={menuItem} />
              <MenuItemOptionsForm menuItem={menuItem} setOpen={setOpen} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MenuItemModalHeader({ menuItem }: { menuItem: MenuItemRequired }) {
  return (
    <DrawerHeader className=" sticky top-0 py-7 px-0 bg-gradient-to-b from-background to-transparent from-70% flex items-start justify-between  flex-row">
      <div className="space-y-4">
        <DrawerTitle className="font-normal ">{menuItem.name}</DrawerTitle>
        <DrawerDescription className="overflow-hidden">
          {menuItem.description}
        </DrawerDescription>
      </div>
      <p>
        <DisplayPrice price={menuItem.priceInCents} />
      </p>
    </DrawerHeader>
  );
}

export function ModalTrigger({ children }: { children: ReactNode }) {
  const { setOpen } = useCardModalContext();
  return (
    <div role="button" onClick={() => setOpen(true)} className="cursor-pointer text-left">
      {children}
    </div>
  );
}
