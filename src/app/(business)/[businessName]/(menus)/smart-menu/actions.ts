"use server";
import { db } from "@/db";
import { Cart, CartItem } from "@/types";
import { revalidateTag } from "next/cache";
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

  console.log(items)

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

  if (menu?.type === "SELF_SERVICE_QR_MENU") {
    redirect(
      "/" +
        businessName.replaceAll(" ", "-") +
        "/smart-menu/order?order=" +
        order.id
    );
  } else {
    redirect(
      "/" +
        businessName.replaceAll(" ", "-") +
        "/smart-menu/order-placed?order=" +
        order.id
    );
  }
}
