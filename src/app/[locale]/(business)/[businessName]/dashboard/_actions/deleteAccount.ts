"use server"
import { signOut } from "@/app/[locale]/(auth)/_actions/login"
import { auth } from "@/auth"
import { db } from "@/db"
import { redirect } from "next/navigation"

export async function deleteAccount() {
    const user = (await auth())?.user
    if (!user) {
        return { error: "User not found" }
    }

    for (const business of user.business) {
        await db.business.delete({
            where: {
                id: business.id
            }
        })
    }

    await db.user.delete({
        where: {
            id: user.id
        }
    })
    await signOut()
    redirect("/")
}
