import { db } from '@/db';
import type { NextRequest } from 'next/server';
import { sendEmptyMenuEmail, sendNoEmailVerifiedEmail, sendNoMenuEmail, sendUnfinishedMenuEmail, sendUpgradeToProEmail } from '@/email/mail';
import { generateVerificationToken } from '@/lib/tokens';
import { NotificationType } from '@prisma/client';

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    const users = await db.user.findMany({
        select: { settings: true, business: { select: { name: true, subscription: true, product: true, menu: { select: { published: true, _count: { select: { menuItems: true } } } } } }, email: true, name: true, id: true, emailVerified: true }
    })

    const verifiedUsers = users.filter((user)=>user.emailVerified)

    const usersWithNoMenu = verifiedUsers.filter((user) => user.business.length === 0 && user.settings?.receiveMenuNotifications)
    for (const user of usersWithNoMenu) {
        if (!(await shouldSendNotification({ email: user.email, type: NotificationType.NO_MENU }))) {
            continue
        }
        await sendNoMenuEmail(user.email, user.name)
        await db.notification.create({ data: { email: user.email, type: NotificationType.NO_MENU, userId: user.id } })
    }


    const usersWithNoEmailVerified = users.filter((user) => !user.emailVerified)
    for (const user of usersWithNoEmailVerified) {
        if (!(await shouldSendNotification({ email: user.email, type: NotificationType.NO_EMAIL_VERIFIED }))) {
            continue
        }

        const verificationToken = await generateVerificationToken(user.email, 24 * 60)
        await sendNoEmailVerifiedEmail(user.email, user.name, verificationToken.token)
        await db.notification.create({ data: { email: user.email, type: NotificationType.NO_EMAIL_VERIFIED, userId: user.id } })
    }



    for (const user of verifiedUsers) {
        const unfinishedBusiness = user.business.find((business) => !business.menu?.published && user.settings?.receiveMenuNotifications)
        if (unfinishedBusiness) {
            if (!(await shouldSendNotification({ email: user.email, type: NotificationType.UNFINISHED_MENU }))) {
                continue
            }
            await sendUnfinishedMenuEmail(user.email, user.name, unfinishedBusiness.product)
            await db.notification.create({ data: { email: user.email, type: NotificationType.UNFINISHED_MENU, userId: user.id } })
        }
    }
    
    const usersWithEmptyMenu = verifiedUsers.filter((user) => user.business.some((business) => business.menu?.published && business.menu?._count.menuItems < 2 && user.settings?.receiveMenuNotifications))
    for (const user of usersWithEmptyMenu) {
        if (!(await shouldSendNotification({ email: user.email, type: NotificationType.EMPTY_MENU }))) {
            continue
        }
        await sendEmptyMenuEmail(user.email, user.name, user.business[0].name)
        await db.notification.create({ data: { email: user.email, type: NotificationType.EMPTY_MENU, userId: user.id } })
    }

    for (const user of verifiedUsers) {
        if (!(await shouldSendNotification({ email: user.email, type: NotificationType.UPGRADE_TO_PRO }))) {
            continue
        }
        const business = user.business.find((business) => business.subscription?.billing === "FREETRIAL" && user.settings?.receivePromotionNotifications)
        if (business) {
            await sendUpgradeToProEmail(user.email, user.name, business.name)
            await db.notification.create({ data: { email: user.email, type: NotificationType.UPGRADE_TO_PRO, userId: user.id } })
        }
    }



    return Response.json({ success: true });
}



async function shouldSendNotification({ email, type }: { email: string, type: NotificationType }) {
    const existingNotification = await db.notification.findFirst({ where: { email, type }, orderBy: { createdAt: 'desc' } })
    const count = await db.notification.count({ where: { email, type } })
    // Only send email if notification was created more than 2 days ago
    if (count > 3) {
        if (existingNotification && existingNotification.createdAt > new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)) {
            return false
        }
        return true
    }

    if (existingNotification && existingNotification.createdAt > new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)) {
        return false
    }


    return true
}