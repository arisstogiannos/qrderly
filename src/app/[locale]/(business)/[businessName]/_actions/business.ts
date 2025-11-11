'use server';

import { z } from 'zod';
import { db } from '@/db';

const TabelsSchema = z.object({
  tables: z.string(),
});

export async function saveTables(businessId: string, prev: any, formData: FormData) {
  const result = TabelsSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    // const rawData = Object.fromEntries(formData) as Partial<Category>;

    return {
      //   data: rawData,
      errors: result.error.flatten().fieldErrors,
    };
  }

  await db.business.update({
    where: { id: businessId },
    data: { tables: result.data.tables },
  });

  return {
    success: true,
  };

  //   revalidateTag("business"+businessId)
}
export async function getCurrency(businessName: string) {
  return await db.business.findUnique({
    where: { name: businessName },
    select: { currency: true },
  });
}
