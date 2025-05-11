import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import React from 'react'
import UnsubscribeForm from './UnsubscribeForm'

export default async function UnsubscribePage({ params }: { params: Promise<{ email?: string }> }) {
    const user = (await auth())?.user
 
    const { email } = await params

    if (!email && !user?.email) {
        redirect("/login")
    }

    if (user?.email && email && user.email !== email) {
        redirect("/")
    }
    
    redirect("/user-settings")

    return null
}
