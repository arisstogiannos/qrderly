"use client";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { ReactNode } from "react";
import { useCardModalContext } from "@/context/CardModalProvider";
import { MenuItemRequired } from "@/types";

export default function MenuItemModal({
  children,
}: {
  children: ReactNode;
  menuItem: MenuItemRequired;
}) {
  const { open, setOpen } = useCardModalContext();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="overflow-hidden rounded-t-3xl border-0 bg-background text-foreground">
        <div className="scrollbar-hidden max-h-[90vh]  overflow-y-auto pb-20 min-[350px]:max-h-[80vh] relative">
          <div className=" px-4 pb-4 relative">{children}</div>
        </div>
      </DrawerContent>
    </Drawer>
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
