"use server";
import { db } from "@/db";
import { Cart, CartItem } from "@/types";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function submitOrder(
  items: CartItem[],
  businessName: string,
  price: number,
  table: string,
  prev:any,
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
  const {
    orders: [order],
    menu,
  } = await db.business.update({
    where: { name: businessName },
    select: {
      orders: { select: { id: true }, orderBy: { createdAt: "desc" } },
      menu: { select: { type: true } },
    },

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
  revalidateTag("orders" + businessName);
  const cookieStore = await cookies()
   cookieStore.set(businessName+"order", order.id,{expires:new Date().setHours(new Date().getHours() + 2)});
   cookieStore.set(businessName+"last-order", order.id,{expires:new Date().setMonth(new Date().getMonth() + 12)});

  if (menu?.type === "SELF_SERVICE_QR_MENU") {
    redirect(
      "/en/" +
        businessName.replaceAll(" ", "-") +
        "/smart-menu/order?order=" +
        order.id
    );
  } else {
    redirect(
      "/en/" +
        businessName.replaceAll(" ", "-") +
        "/smart-menu/order-placed?order=" +
        order.id
    );
  }
}
