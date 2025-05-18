"use client";

import type {  CartItem, MenuItemRequired } from "@/types";
import type React from "react";
import {
  createContext,type 
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

type CartContextType = {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  increaseItemQuantity: (cartItemId: string, currQuantity: number) => void;
  decreaseItemQuantity: (cartItemId: string, currQuantity: number) => void;
  addToCart: (menuItem: MenuItemRequired, selectedPreferances: string,price:number) => void;
  updateCartItem: (selectedPreferances: string, cartItemId: string,price:number) => void;
};

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartContextProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  //   useEffect(()=>{
  //     localStorage.setItem()
  //
  //   },[cartItems])

  function increaseItemQuantity(cartItemId: string, currQuantity: number) {
    setCartItems((prev) => {
      const updatedCart = prev.map((item) => {
        if (item.id === cartItemId) {
          return {
            id: item.id,
            quantity: currQuantity + 1,
            menuItem: item.menuItem,
            preferences: item.preferences,
            price: item.price,
          };
        }

        return item;
      });

      return updatedCart;
    });
  }
  function decreaseItemQuantity(cartItemId: string, currQuantity: number) {
    setCartItems((prev) => {
      const updatedCart = prev
        .map((item) => {
          if (item.id === cartItemId) {
            if (currQuantity > 1) {
              return {
                id: item.id,
                quantity: currQuantity - 1,
                menuItem: item.menuItem,
                preferences: item.preferences,
              };
            } else {
              return null;
            }
          }

          return item;
        })
        .filter(Boolean) as CartItem[];

      return updatedCart;
    });
  }

  function addToCart(menuItem: MenuItemRequired, selectedPreferances: string,price:number) {
    let itemToAdd: CartItem;
    setCartItems((prev) => {
      itemToAdd = {
        id: crypto.randomUUID(),
        quantity: 1,
        preferences: selectedPreferances,
        price:price,
        menuItem: {
          id: menuItem.id,
          name: menuItem.name,
          priceInCents: menuItem.priceInCents,
          description: menuItem.description,
          imagePath: menuItem.imagePath,
          preferences: menuItem.preferences,
          translations: menuItem.translations,
        },
      };

      const existingItemIndex = prev.findIndex(
        (item) =>
          item.menuItem.id === itemToAdd.menuItem.id &&
          item.preferences === itemToAdd.preferences
      );

      if (existingItemIndex !== -1) {
        return prev.map((item, i) =>
          existingItemIndex === i
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, itemToAdd];
      // }
    });
  }

  function updateCartItem(selectedPreferances: string, cartItemId: string,price:number) {
    setCartItems((prev) => {
      const existingItemWithSameOptions = prev.find(
        (item) => item.preferences === selectedPreferances
      );
      const itemToUpdate = prev.find((item) => item.id === cartItemId);

      if (itemToUpdate?.preferences !== selectedPreferances) {
        if (existingItemWithSameOptions) {
          return prev
            .map((item) =>
              item.preferences === selectedPreferances
                ? {
                    ...item,
                    quantity: item.quantity + (itemToUpdate?.quantity || 1),
                  }
                : item
            )
            .filter((item) => item.id !== cartItemId);
        }
        
        return prev.map((item) =>
          item.id === cartItemId
        ? { ...item, preferences: selectedPreferances,price:price }
        : item
      );
    }
    return prev
      // }
    });
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        increaseItemQuantity,
        decreaseItemQuantity,
        addToCart,
        updateCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCartContext outside provider");
  }

  return context;
}
