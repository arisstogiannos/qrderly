'use client';
import { Edit, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import type { CartItem } from '@/types';

export default function MenuItemVersionsInCart({
  setCartItemVersionId,
  cartItemVersionId,
  existingMenuItems,
}: {
  setCartItemVersionId: React.Dispatch<React.SetStateAction<string>>;
  cartItemVersionId: string;
  existingMenuItems: CartItem[];
}) {
  return (
    <RadioGroup
      className="space-y-1 "
      onValueChange={(v) => setCartItemVersionId(v)}
      value={cartItemVersionId}
    >
      {existingMenuItems.map((existingMenuItem) => (
        <div
          className={cn(
            'flex cursor-pointer items-center gap-x-4 bg-secondary rounded-lg   text-myWhite  px-4',
            cartItemVersionId === existingMenuItem.id &&
              ' outline-2  outline-primary text-primary z-50',
          )}
          key={existingMenuItem.id}
        >
          <span className="size-5 font-semibold text-sm md:text-base">
            {existingMenuItem.quantity}
          </span>

          <RadioGroupItem
            value={existingMenuItem.id}
            key={existingMenuItem.id}
            id={existingMenuItem.id}
            className="sr-only"
          />
          <Label
            htmlFor={existingMenuItem.id}
            className="flex w-full cursor-pointer items-center justify-between py-3 text-sm font-light md:text-base"
          >
            <span className="mr-8 font-light">
              {existingMenuItem.preferences && existingMenuItem.preferences}
            </span>
            <Edit />
          </Label>
        </div>
      ))}
      <div
        className={cn(
          'flex cursor-pointer items-center gap-x-4 bg-secondary-menu rounded-lg   text-myWhite  px-4',
          cartItemVersionId === '' && ' outline-2  outline-primary text-primary',
        )}
      >
        <RadioGroupItem value="" key={'add-new'} id={'add-new'} className="sr-only" />
        <Label
          htmlFor="add-new"
          className="flex w-full cursor-pointer items-center justify-between py-3 text-base font-normal capitalize"
        >
          <span>Add new with different choices</span>
          <Plus />
        </Label>
      </div>
    </RadioGroup>
  );
}
