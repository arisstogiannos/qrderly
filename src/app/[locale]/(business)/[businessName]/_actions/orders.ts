"use server";

import { db } from "@/db";
import getSession from "@/lib/getSession";
import { revalidateTag } from "next/cache";

export async function getAllOrders(businessName: string) {
  const orders = await db.order.findMany({
    where: { business: { name: businessName } },
    select: {
      createdAt: true,
      orderItems: { include: { menuItem: true } },
      price: true,
      status: true,
      table: true,
      completedAt: true,
      id: true,
    },
  });

  return orders;
}
export async function getOrderById(id: string) {
  const order = await db.order.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      price: true,

      orderItems: {
        select: {
          menuItem: { select: { name: true, priceInCents: true } },
          quantity: true,
          price:true
        },
      },
    },
  });

  return order;
}
export async function getPendingOrders(businessName: string) {
  const orders = await db.order.findMany({
    where: { business: { name: businessName }, status: "PENDING" },
    select: {
      createdAt: true,
      orderItems: { include: { menuItem: true } },
      price: true,
      status: true,
      table: true,
      completedAt: true,
      id: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return orders;
}

export async function deletOrder(id: string, businessName?: string) {
  try {
    await db.order.delete({
      where: { id },
    });
  } catch (err) {
    console.error(err);
    return { success: false, error: "Something went wrong!" };
  }
  revalidateTag("orders" + businessName);
  return { success: true };
}

export async function completeOrder(id: string) {
  try {
    const order = await db.order.update({
      where: { id },
      data: {
        status: "COMPLETED",
      },
    });
    const business = (await getSession())?.user.business.find((b)=> b.id ===  order.businessId);
    revalidateTag("order" + business?.name);
  } catch (err) {
    console.error(err);
    return { success: false, error: "Something went wrong!" };
  }
  return { success: true };
}
