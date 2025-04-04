"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { X } from "lucide-react";
import { ModalProvider } from "@/context/ModalProvider";
import { cn } from "@/lib/utils";

export function Modal({
  title,
  subtitle,
  children,
  trigger,
  classNames,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  trigger: React.ReactNode;
  classNames?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    setIsDesktop(window.innerWidth > 770);
    function handleResize(e: Event) {
      setIsDesktop(window.innerWidth > 770);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen} >
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className={cn("max-w-xl ", classNames)}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{subtitle}</DialogDescription>
          </DialogHeader>
          <ModalProvider open={open} setOpen={setOpen}>
            {children}
          </ModalProvider>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className={cn("px-4 pb-2 ", classNames)}>
        <DrawerHeader className="text-left ml-0 p-0 pb-4">
          <DrawerTitle className="text-xl">{title}</DrawerTitle>
          <DrawerDescription className="sr-only">{subtitle}</DrawerDescription>
          <DrawerClose>
            <X className="bg-foreground text-background rounded-full absolute right-5 top-5 size-8 p-1" />
          </DrawerClose>
        </DrawerHeader>
        <ModalProvider open={open} setOpen={setOpen}>
          {children}
        </ModalProvider>
        {/* <DrawerFooter className="bottom-0 fixed w-full left-0">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  );
}
