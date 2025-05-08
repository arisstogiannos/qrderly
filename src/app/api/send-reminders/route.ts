import { db } from '@/db';
import type { NextRequest } from 'next/server';
import { sendNoEmailVerifiedEmail, sendNoMenuEmail, sendUnfinishedMenuEmail } from '@/email/mail';
import { generateVerificationToken } from '@/lib/tokens';
import { NotificationType } from '@prisma/client';

export async function GET(request: NextRequest) {
      const authHeader = request.headers.get('authorization');
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
          status: 401,
        });
      }

    const users = await db.user.findMany({ select: { business: { select: { product: true, menu: { select: { published: true , _count:{select:{menuItems:true}}} } } }, email: true, name: true, id: true, emailVerified: true } })

    const usersWithNoMenu = users.filter((user) => !user.business)

    for (const user of usersWithNoMenu) {
        const existingNotification = await db.notification.findFirst({ where: { email: user.email, type: NotificationType.NO_MENU }, orderBy: { createdAt: 'desc' } })
        // Only send email if notification was created more than 7 days ago
        if (existingNotification && existingNotification.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
            continue
        }
        await sendNoMenuEmail(user.email, user.name)
        await db.notification.create({ data: { email: user.email, type: NotificationType.NO_MENU, userId: user.id } })
    }

    const usersWithNoEmailVerified = users.filter((user) => !user.emailVerified)

    for (const user of usersWithNoEmailVerified) {
        const existingNotification = await db.notification.findFirst({ where: { email: user.email, type: NotificationType.NO_EMAIL_VERIFIED }, orderBy: { createdAt: 'desc' } })
        // Only send email if notification was created more than 7 days ago
        if (existingNotification && existingNotification.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
            continue
        }
        const verificationToken = await generateVerificationToken(user.email, 24 * 60)
        await sendNoEmailVerifiedEmail(user.email, user.name, verificationToken.token)
        await db.notification.create({ data: { email: user.email, type: NotificationType.NO_EMAIL_VERIFIED, userId: user.id } })
    }

    
    
    for (const user of users) {
        const unfinishedBusiness = user.business.find((business) => !business.menu?.published)
        if (unfinishedBusiness) {
            const existingNotification = await db.notification.findFirst({ where: { email: user.email, type: NotificationType.UNFINISHED_MENU }, orderBy: { createdAt: 'desc' } })
            // Only send email if notification was created more than 7 days ago
            if (existingNotification && existingNotification.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
                continue
            }
            await sendUnfinishedMenuEmail(user.email, user.name, unfinishedBusiness.product)
            await db.notification.create({ data: { email: user.email, type: NotificationType.UNFINISHED_MENU, userId: user.id } })
        }
    }
    // const usersWithEmptyMenu = users.filter((user) => user.business.some((business) => business.menu?.published && business.menu?._count.menuItems === 0))

    // for (const user of usersWithEmptyMenu) {
    //     const existingNotification = await db.notification.findFirst({ where: { email: user.email, type: NotificationType.EMPTY_MENU }, orderBy: { createdAt: 'desc' } })
    //     if (existingNotification && existingNotification.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
    //         continue
    //     }
    //     await sendEmptyMenuEmail(user.email, user.name)
    //     await db.notification.create({ data: { email: user.email, type: NotificationType.EMPTY_MENU, userId: user.id } })
    // }


    return Response.json({ success: true });
}