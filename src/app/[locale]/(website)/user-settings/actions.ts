'use server';

import type { Settings } from '@prisma/client';
import { db } from '@/db';

export async function updateSettings(settings: Omit<Settings, 'createdAt'>) {
  await db.settings.update({ where: { id: settings.id }, data: settings });
}
