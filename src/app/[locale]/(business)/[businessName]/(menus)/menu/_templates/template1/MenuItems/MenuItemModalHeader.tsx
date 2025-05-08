import DisplayPrice from "@/components/DisplayPrice";
import {
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { MenuItemRequired } from "@/types";
import React from "react";

export default function MenuItemModalHeader({
  menuItem,
}: {
  menuItem: MenuItemRequired;
}) {
  return (
    <DrawerHeader className=" sticky top-0 py-7 bg-gradient-to-b from-background to-transparent from-70% flex items-start justify-between text-foreground flex-row">
      <div className="space-y-4">
        <DrawerTitle className="font-normal ">{menuItem.name}</DrawerTitle>
        <DrawerDescription className="overflow-hidden">
          {menuItem.description}
        </DrawerDescription>
      </div>
      <p>
        <DisplayPrice price={menuItem.priceInCents } />
      </p>
    </DrawerHeader>
  );
}
