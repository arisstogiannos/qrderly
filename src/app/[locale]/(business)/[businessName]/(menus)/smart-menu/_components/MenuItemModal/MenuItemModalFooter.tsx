"use client";
import { Button } from "@/components/ui/button";
import { useCardModalContext } from "@/context/CardModalProvider";

import { useCartContext } from "@/context/CartContext";
import { formatCurrency } from "@/lib/formatter";
import { CartItem } from "@/types";
import { Edit2, MinusIcon, PlusIcon, X } from "lucide-react";
import { useEffect } from "react";

export default function MenuItemModalFooter({
  item,
}: {
  item: CartItem | undefined;
}) {
  const { increaseItemQuantity, decreaseItemQuantity } = useCartContext();
  const {price} = useCardModalContext()



  return (
    <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-myBlack from-60% to-transparent p-4 ">
      <div className="flex w-full items-center justify-between gap-10">
        {item ? (
          <div className="flex items-center  gap-x-3 text-lg w-fit">
            <Button
              type="button"
              onClick={() => decreaseItemQuantity(item.id, item.quantity)}
              className="size-7 cursor-pointer rounded-md bg-primary p-3 text-white"
            >
              <MinusIcon />
            </Button>
            {item.quantity}
            <Button
              type="button"
              className="text-whitex size-7 cursor-pointer rounded-md bg-primary p-3"
              onClick={() => increaseItemQuantity(item.id, item.quantity)}
            >
              <PlusIcon />
            </Button>
          </div>
        ) : null}
        {item ? (
          <Button
            type="submit"
            className="flex  items-center justify-center gap-3 capitalize grow"
          >
            Update order  {formatCurrency(price/100)}
            <Edit2 />
          </Button>
        ) : (
          <Button
            type="submit"
            className="flex w-full items-center justify-center gap-3 capitalize"
          >
            Add to Cart {formatCurrency(price/100)}
            {/* <AddToCartIcon /> */}
          </Button>
        )}
      </div>
    </div>
  );
}
