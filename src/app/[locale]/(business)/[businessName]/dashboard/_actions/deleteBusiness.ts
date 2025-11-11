'use server';

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/db';

export async function deleteBusiness(businessId: string) {
  const user = (await auth())?.user;
  if (!user) return { error: 'User not found' };

  const business = user.business.find((business) => business.id === businessId);
  if (!business) return { error: 'Business not found' };

  await db.business.delete({
    where: { id: businessId },
  });
  redirect('/');
}
