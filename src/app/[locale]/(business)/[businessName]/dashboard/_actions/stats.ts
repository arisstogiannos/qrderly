"use server";

import { db } from "@/db";

export async function getTotalScans(businessId: string) {
  return await db.scan.count({ where: { businessId } });
}
export async function getTotalOrders(businessId: string) {
  return await db.order.count({ where: { businessId } });
}
export async function getTotalRevenue(businessId: string) {
  const orders=  await db.order.findMany({ where: { businessId },select:{price:true} });
  let totalRevenue = 0
  orders.forEach((or)=>totalRevenue+=or.price)

  return totalRevenue
}




const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export async function getOrdersPerDay(businessId: string) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const orders = await db.order.findMany({
    where: {
      businessId,
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    select: {
      createdAt: true,
      price: true,
    },
  });

  // Init count map for all days
  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  };

  // Group by day of week
  for (const order of orders) {
    const day = DAY_LABELS[order.createdAt.getDay()];
    dayMap[day]++;
  }

  // Convert to array
  const orderData = DAY_LABELS.map((day) => ({
    name: day,
    orders: dayMap[day],
  }));

  return orderData;
}

export async function getScansPerDay(businessId: string) {

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const scans = await db.scan.findMany({
    where: {
      businessId,
      date: {
        gte: sevenDaysAgo,
      },
    },
    select: {
      date: true,
    },
  });

  // Init count map for all days
  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  };

  // Group by day of week
  for (const scan of scans) {
    const day = DAY_LABELS[scan.date.getDay()];
    dayMap[day]++;
  }

  // Convert to array
  const scanData = DAY_LABELS.map((day) => ({
    name: day,
    visits: dayMap[day],
  }));

  return scanData;
}

export async function getPopularItems(businessId: string) {

  const popularItems = await db.menuItem.findMany({
    where: {
      menu:{business:{id:businessId}}
    },
    select:{_count:{select:{orderItems:true}},name:true},
    orderBy:{orderItems:{_count:"desc"}},
    take:4
  });

  return popularItems.flatMap((it)=>({name:it.name,value:it._count.orderItems}))
}


function formatData(data:any[]){

}
