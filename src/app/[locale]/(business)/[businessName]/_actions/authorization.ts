'use server';

import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import getSession from '@/lib/getSession';

export async function checkUserAuthorized(businessName: string) {
  const session = await getSession();
  const userRole = session?.user.role;
  const businesses = session?.user.business;

  if (userRole !== UserRole.ADMIN) {
    redirect('/unauthorized');
  }

  if (!businesses) {
    redirect('/unauthorized');
  }

  for (const b of businesses) {
    if (b.name === businessName) {
      return { user: session.user, business: b };
    }
  }

  redirect('/unauthorized');
}
