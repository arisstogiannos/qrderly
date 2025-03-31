"use server";

import { db } from "@/db";
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

export async function deletOrder(id: string) {
  try {
    await db.order.delete({
      where: { id },
    });
  } catch (err) {
    console.error(err);
    return { success: false, error: "Something went wrong!" };
  }
  // revalidateTag("orders");
  return { success: true };
}

export async function completeOrder(id: string) {
  try {
    await db.order.update({
      where: { id },
      data: {
        status: "COMPLETED",
      },
    });
  } catch (err) {
    console.error(err);
    return { success: false, error: "Something went wrong!" };
  }
  return { success: true };
}
