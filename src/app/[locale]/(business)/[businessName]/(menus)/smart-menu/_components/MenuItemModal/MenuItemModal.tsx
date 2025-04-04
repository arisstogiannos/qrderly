"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ReactNode } from "react";
import { formatCurrency } from "@/lib/formatter";
import CloudImage from "@/components/CloudImage";
import { useCardModalContext } from "@/context/CardModalProvider";
import MenuItemOptionsForm from "./MenuItemForm";
import { MenuItemRequired } from "@/types";

export default function MenuItemModal({
  menuItem,
  withImage,
}: {
  menuItem: MenuItemRequired;
  withImage: boolean;
}) {
  const { open, setOpen } = useCardModalContext();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="overflow-hidden rounded-t-3xl border-0 bg-background text-foreground">
        <div className="scrollbar-hidden max-h-[90vh]  overflow-y-auto pb-20 min-[350px]:max-h-[80vh] relative">
          {withImage && (
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
          )}

          <div className=" px-4 pb-4 relative">
            <MenuItemModalHeader menuItem={menuItem} />
            <MenuItemOptionsForm menuItem={menuItem} setOpen={setOpen} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function MenuItemModalHeader({ menuItem }: { menuItem: MenuItemRequired }) {
  return (
    <DrawerHeader className=" sticky top-0 py-7 px-0 bg-gradient-to-b from-myBlack to-transparent from-70% flex items-start justify-between  flex-row">
      <div className="space-y-4">
        <DrawerTitle className="font-normal ">{menuItem.name}</DrawerTitle>
        <DrawerDescription className="overflow-hidden">
          {menuItem.description}
        </DrawerDescription>
      </div>
      <p>{formatCurrency(menuItem.priceInCents / 100)}</p>
    </DrawerHeader>
  );
}

export function ModalTrigger({ children }: { children: ReactNode }) {
  const { setOpen } = useCardModalContext();
  return (
    <div onClick={() => setOpen(true)} className="cursor-pointer">
      {children}
    </div>
  );
}
