import DisplayPrice from "@/components/DisplayPrice";
import {
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { MenuItemRequired } from "@/types";
import React from "react";

export default function MenuItemModalHeader({
  menuItem,
}: {
  menuItem: MenuItemRequired;
}) {
  return (
    <DrawerHeader className=" sticky top-0 py-7 bg-gradient-to-b from-background to-transparent from-70% flex items-start justify-between text-foreground flex-row px-0">
      <div className="space-y-4">
        <DrawerTitle className="font-normal  text-xl">
          {menuItem.name}
        </DrawerTitle>
        <DrawerDescription className="overflow-hidden text-base">
          {menuItem.description}
        </DrawerDescription>
      </div>
      <p>
        <DisplayPrice price={menuItem.priceInCents } />
      </p>
    </DrawerHeader>
  );
}
