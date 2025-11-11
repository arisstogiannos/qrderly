'use server';
import { cacheLife, cacheTag } from 'next/cache';
import { db } from '@/db';

export async function getSale() {
  'use cache';
  cacheTag('banner');
  cacheLife({ revalidate: 60 * 60 });

  return await db.banner.findFirst({
    where: { targetTime: { gte: new Date() } },
  });
}
