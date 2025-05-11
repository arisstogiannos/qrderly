"use server"

import { db } from "@/db"
import type { Settings } from "@prisma/client"

export async function updateSettings(settings: Omit<Settings, 'createdAt'>) {
    await db.settings.update({ where: { id: settings.id }, data: settings })
}   
