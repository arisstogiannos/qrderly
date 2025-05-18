"use client";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import type { ReactNode } from "react";
import { useCardModalContext } from "@/context/CardModalProvider";
import type { MenuItemRequired } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function MenuItemModal({
  children,
}: {
  children: ReactNode;
  menuItem: MenuItemRequired;
}) {
  const { open, setOpen } = useCardModalContext();
  const isMobile = useIsMobile();

  if (isMobile)
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="overflow-hidden rounded-t-3xl border-0 bg-background text-foreground">
          <div className="scrollbar-hidden max-h-[90vh]  overflow-y-auto pb-20 min-[350px]:max-h-[80vh] relative">
            <div className=" px-4 pb-4 relative">{children}</div>
          </div>
        </DrawerContent>
      </Drawer>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden  border-0 bg-secondary text-foreground focus:outline-none p-0">
        <div className="scrollbar-hidden max-h-[90vh]  overflow-y-auto pb-20 min-[350px]:max-h-[80vh] relative">
          <div className=" px-4 pb-4 relative">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
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
