"use client";
import { cn } from "@/lib/utils";

import { FormEvent, useState } from "react";

import { useCartContext } from "@/context/CartContext";

import { MenuItemRequired } from "@/types";

import { toast } from "sonner";
import MenuItemVersionsInCart from "./MenuItemVersionsInCart";
import Options from "./Options";
import MenuItemModalFooter from "./MenuItemModalFooter";

export default function MenuItemOptionsForm({
  menuItem,
  setOpen,
}: {
  menuItem: MenuItemRequired;
  setOpen: (value: boolean) => void;
}) {
  const { cartItems, addToCart, updateCartItem } = useCartContext();
  const [cartItemVersionId, setCartItemVersionId] = useState<string>("");
  const [price, setPrice] = useState(0);

  const existingMenuItems = cartItems.filter(
    (item) => item.menuItem.id === menuItem.id
  );

  const existingMenuItem = existingMenuItems.find(
    (item) => item.id === cartItemVersionId
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    console.log(data)
    const dataAsString = JSON.stringify(data)
      .replaceAll(`"`, "")
      .replaceAll(",", ", ")
      .slice(1, -1);
    if (cartItemVersionId === "") {
      addToCart(menuItem, dataAsString);
    } else {
      updateCartItem(dataAsString, cartItemVersionId);
    }
    toast("Item added to cart");
    setOpen(false);
  }

  return (
    <form className={cn("grid items-start gap-6")} onSubmit={handleSubmit}>
      {existingMenuItems && (
        <MenuItemVersionsInCart
          setCartItemVersionId={setCartItemVersionId}
          cartItemVersionId={cartItemVersionId}
          existingMenuItems={existingMenuItems}
        />
      )}
      <Options
        price={price}
        setPrice={setPrice}
        options={menuItem.preferences ?? ""}
        existingOptions={existingMenuItem?.preferences}
      />
      <MenuItemModalFooter  item={existingMenuItem} />
    </form>
  );
}
