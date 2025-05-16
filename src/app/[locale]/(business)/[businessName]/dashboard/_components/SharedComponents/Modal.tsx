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

import { ChevronDown, X } from "lucide-react";
import { ModalProvider } from "@/context/ModalProvider";
import { cn } from "@/lib/utils";

export function Modal({
  title,
  subtitle,
  children,
  initialOpen,
  firstOpen,
  trigger,
  classNames,
  animate = true,
  showDesc = false
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  initialOpen?:boolean;
  firstOpen?:boolean;
  trigger: React.ReactNode;
  classNames?: string;
  animate?: boolean;
  showDesc?:boolean
}) {
  const [open, setOpen] = React.useState(firstOpen??false);
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
      <Dialog open={initialOpen??open} onOpenChange={setOpen}   >
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className={cn("max-w-xl ", classNames)}  animate={animate} onCloseAutoFocus={(e) => e.preventDefault()} autoFocus={false} >
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
    //enable scrolling when modal is closing
    <Drawer 
      open={initialOpen??open} 
      onOpenChange={setOpen} 

    >
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className={cn("px-4 pb-2 ", classNames)} animate={animate} onCloseAutoFocus={(e) => e.preventDefault()}  autoFocus={false}  >
        <DrawerHeader className="text-left ml-0 p-0 pb-4">
          <DrawerTitle className="text-xl">{title}</DrawerTitle>
          <DrawerDescription className={!showDesc?"sr-only":""}>{subtitle}</DrawerDescription>
          <DrawerClose>
            <ChevronDown className="bg-foreground text-background rounded-full absolute right-5 top-5 size-8 p-1" />
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
