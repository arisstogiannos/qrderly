'use client';

import { ChevronDown } from 'lucide-react';
import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ModalProvider } from '@/context/ModalProvider';
import { cn } from '@/lib/utils';

export function Modal({
  title,
  subtitle,
  children,
  initialOpen,
  firstOpen,
  openParent,
  trigger,
  classNames,
  animate = true,
  showDesc = false,
  setOpenParent,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  initialOpen?: boolean;
  firstOpen?: boolean;
  openParent?: boolean;
  setOpenParent?: React.Dispatch<React.SetStateAction<boolean>>;
  trigger: React.ReactNode;
  classNames?: string;
  animate?: boolean;
  showDesc?: boolean;
}) {
  const [open, setOpen] = React.useState(firstOpen ?? false);
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    setIsDesktop(window.innerWidth > 770);
    function handleResize(e: Event) {
      setIsDesktop(window.innerWidth > 770);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOpenChange = (newOpen: boolean) => {
    if (setOpenParent) {
      setOpenParent(newOpen);
    } else {
      setOpen(newOpen);
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={openParent ?? initialOpen ?? open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent
          className={cn('max-w-xl', classNames)}
          animate={animate}
          onCloseAutoFocus={(e) => e.preventDefault()}
          autoFocus={false}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="text-pretty">{subtitle}</DialogDescription>
          </DialogHeader>
          <ModalProvider open={openParent ?? open} setOpen={handleOpenChange}>
            {children}
          </ModalProvider>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={openParent ?? initialOpen ?? open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent
        className={cn('px-4 pb-2', classNames)}
        animate={animate}
        onCloseAutoFocus={(e) => e.preventDefault()}
        autoFocus={false}
      >
        <DrawerHeader className="text-left ml-0 p-0 pb-4">
          <DrawerTitle className="text-xl">{title}</DrawerTitle>
          <DrawerDescription className={!showDesc ? 'sr-only' : 'text-pretty pr-20'}>
            {subtitle}
          </DrawerDescription>
          <DrawerClose>
            <ChevronDown className="bg-foreground text-background rounded-full absolute right-5 top-5 size-8 p-1" />
          </DrawerClose>
        </DrawerHeader>
        <ModalProvider open={openParent ?? open} setOpen={handleOpenChange}>
          {children}
        </ModalProvider>
      </DrawerContent>
    </Drawer>
  );
}
