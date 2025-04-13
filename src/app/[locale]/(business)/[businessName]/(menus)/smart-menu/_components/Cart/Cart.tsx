"use client";
import { ShoppingBag } from "lucide-react";
import React, { Suspense, useActionState, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useCartContext } from "@/context/CartContext";

import { Button } from "@/components/ui/button";
import { CartItem } from "./CartItem";
import { submitOrder } from "../../actions";
import { useSearchParams } from "next/navigation";
import Loader from "@/components/Loader";
import { Product } from "@prisma/client";
import DisplayPrice from "@/components/DisplayPrice";
import { usePreventRefresh } from "@/hooks/use-prevent-reload";

// type Product = {
//   id: string;
//   name: string;
//   priceInCents: number;
//   description: string;
//   imagePath: string;
// };

// type CartItem = {
//   id: string;
//   quantity: number;
//   product: Product;
//   options: string;
// };

export default function Cart({
  businessName,
  menuType,
}: {
  businessName: string;
  menuType: Product;
}) {
  const [open, setOpen] = useState(false);
  const table = useSearchParams().get("table");
  const { cartItems } = useCartContext();
  usePreventRefresh("Cart items will be lost if you reload. Do you want to continue?",cartItems.length>0)

  let total = 0;
  let noItems = 0;
  cartItems.forEach((item) => {
    total += item.quantity * item.price;
    noItems += item.quantity;
  });
  const [state, action, isPending] = useActionState(
    submitOrder.bind(
      null,
      cartItems,
      businessName,
      total,
      table ?? ""
      // menuType === "SELF_SERVICE_QR_MENU" ? "Takeaway" : (table ?? "")
    ),
    null
  );

  // if(!table) throw new Error("Please scan the Qr Code again.")

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="relative rounded-full bg-secondary p-2 text-foreground">
        <ShoppingBag size={"1.75rem"} />
        <div className="absolute left-3/4 top-3/4 size-5 place-content-center rounded-full bg-primary text-center text-xs">
          {noItems}
        </div>
      </SheetTrigger>
      <SheetContent className=" bg-background text-foreground px-2 max-md:w-[350px] flex flex-col  pt-6 border-0">
        <SheetTitle className="mb-3 ">Order Items</SheetTitle>
        <SheetDescription className="sr-only">
          {" "}
          List of the items you want to order
        </SheetDescription>
        <div className="scrollbar-hidden lg:scrollbarContainer flex flex-col overflow-y-auto h-full gap-4 mb-10 rounded-xl ">
          <Suspense>
            {cartItems.length > 0 ? (
              <>
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </>
            ) : (
              <span>Empty</span>
            )}
          </Suspense>
        </div>
        <SheetFooter className="mt-auto px-0">
          <form action={action}>
            <Button
              disabled={
                cartItems.length === 0 ||
                (!table && menuType === "SMART_QR_MENU") ||
                isPending
              }
              type="submit"
              className="w-full capitalize"
            >
              {table || menuType === "SELF_SERVICE_QR_MENU" ? (
                isPending ? (
                  <Loader />
                ) : (
                  <span>
                    {" "}
                    Complete Order <DisplayPrice price={total } />
                  </span>
                )
              ) : (
                <span>You can only order by scanning qr</span>
              )}
            </Button>
          </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
