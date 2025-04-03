"use client";
import { MinusIcon, PlusIcon } from "lucide-react";
import React from "react";

import { formatCurrency } from "@/lib/formatter";
import { useCartContext } from "@/context/CartContext";
import CloudImage from "@/components/CloudImage";
import { CartItem as CartItemType, Translation } from "@/types";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export function CartItem({ item }: { item: CartItemType }) {
  const { menuItem, quantity, id,price } = item;
  const context = useCartContext();
  const increaseContextItemQuantity = context?.increaseItemQuantity;
  const decreaseContextItemQuantity = context?.decreaseItemQuantity;
  const searchParams = useSearchParams();
  const lang = searchParams.get("l") ?? 0;
  const translationsAsJson: Translation | null = item.menuItem.translations
    ? JSON.parse(item.menuItem.translations)
    : null;
  const existingTranslation = translationsAsJson && translationsAsJson[lang];

  function handleIncrease() {
    increaseContextItemQuantity(id, quantity);
  }
  function handleDecrease() {
    decreaseContextItemQuantity(id, quantity);
  }

  return (
    <div className="flex w-full gap-x-5 rounded-lg bg-secondary p-2 duration-1000">
      <div className="relative size-20 overflow-hidden rounded-lg object-fill md:size-28">
        <CloudImage
          src={menuItem.imagePath ?? ""}
          fill
          className="absolute inset-0 object-cover"
          alt={menuItem.name}
        />
      </div>
      <div className="flex w-1/2 flex-col gap-y-0">
        <span className="capitalize">
          {existingTranslation
            ? translationsAsJson[lang].name
            : item.menuItem.name}
        </span>
        <span className="line-clamp-2 text-sm text-muted-foreground first-letter:uppercase md:text-base">
          {item.preferences}
        </span>
        <div className="mt-auto flex items-center gap-x-3">
          <Button
            onClick={handleDecrease}
            className="size-5 cursor-pointer rounded-md bg-primary p-3 text-white"
          >
            <MinusIcon />
          </Button>
          {quantity}
          <Button
            className="text-white size-5 cursor-pointer rounded-md bg-primary p-3"
            onClick={handleIncrease}
          >
            <PlusIcon />
          </Button>
        </div>
      </div>
      <div className="ml-auto">
        <span className="">
          {formatCurrency((price / 100) * quantity)}
        </span>
      </div>
    </div>
  );
}
