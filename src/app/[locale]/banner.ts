'use server';
import { db } from '@/db';

export async function getSale() {
  return await db.banner.findFirst({
    where: { targetTime: { gte: new Date() } },
  });
}
