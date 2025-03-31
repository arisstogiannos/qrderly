import { DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { formatCurrency } from '@/lib/formatter';
import { MenuItemRequired } from '@/types';
import React from 'react'

export default function MenuItemModalHeader({ menuItem }: { menuItem: MenuItemRequired }) {
    return (
      <DrawerHeader className=" sticky top-0 py-7 bg-gradient-to-b from-secondary to-transparent from-70% flex items-start justify-between text-foreground flex-row">
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
