"use client";
import { cn } from "@/lib/utils";

import { FormEvent, useEffect, useState } from "react";

import { useCartContext } from "@/context/CartContext";

import { MenuItemRequired } from "@/types";

import { toast } from "sonner";
import MenuItemVersionsInCart from "./MenuItemVersionsInCart";
import Options from "./Options";
import MenuItemModalFooter from "./MenuItemModalFooter";
import { CheckCircleIcon } from "lucide-react";
import { useCardModalContext } from "@/context/CardModalProvider";

export default function MenuItemOptionsForm({
  menuItem,
  setOpen,
}: {
  menuItem: MenuItemRequired;
  setOpen: (value: boolean) => void;
}) {
  const { cartItems, addToCart, updateCartItem } = useCartContext();
  const [cartItemVersionId, setCartItemVersionId] = useState<string>("");
const {setPrice,price} = useCardModalContext()
  const existingMenuItems = cartItems.filter(
    (item) => item.menuItem.id === menuItem.id
  );

  useEffect(()=>{

    setPrice(menuItem.priceInCents)
  },[])

  const existingMenuItem = existingMenuItems.find(
    (item) => item.id === cartItemVersionId
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    const dataAsString = JSON.stringify(data)
      .replaceAll(`"`, "")
      .replaceAll(",", ", ")
      .slice(1, -1);
    if (cartItemVersionId === "") {
      addToCart(menuItem, dataAsString,price);
    } else {
      updateCartItem(dataAsString, cartItemVersionId,price);
    }
    toast(" Item added to cart",{duration:1500,icon:<CheckCircleIcon/> ,position:"top-left",style:{width:'60%', backgroundColor:"lightgreen", color:"darkgreen",borderColor:"darkgreen"}});
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
        options={menuItem.preferences ?? ""}
        existingOptions={existingMenuItem?.preferences}
      />
      <MenuItemModalFooter  item={existingMenuItem}  />
    </form>
  );
}
