"use server";
import { db } from "@/db";
import { Cart, CartItem } from "@/types";
import { redirect } from "next/navigation";

export async function submitOrder(
  items: CartItem[],
  businessName: string,
  price: number,
  table:string
) {
  type CartItemWithoutMenuItem = Omit<CartItem, "menuItem"> & {
    menuItemId: string;
  };

  const itemsWithoutMenuItem: CartItemWithoutMenuItem[] = items.map(
    ({ menuItem, ...item }) => ({
      ...item,
      menuItemId: menuItem.id,
    })
  );

  await db.business.update({
    where: { name: businessName },
    data: {
      orders: {
        create: {
          status: "PENDING",
          price,
          table: table,

          orderItems: {
            createMany: {
              data: itemsWithoutMenuItem,
            },
          },
        },
      },
    },
  });

  redirect("/"+businessName+"/order-placed-successfuly")
}
