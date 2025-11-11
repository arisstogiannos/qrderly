'use server';

import type { Product } from '@prisma/client';
import { revalidateTag, unstable_cache } from 'next/cache';
import { db } from '@/db';
import { sendTrialEndedEmail } from '@/email/mail';

export async function getMenu(businessName: string) {
  const menu = await db.menu.findFirst({
    where: { business: { name: businessName } },
  });

  return menu;
}
// export async function getMenuById(id: string) {
//   const menu = await db.menu.findUnique({
//     where: { id } ,
//   });

//   return menu;
// }
export async function getMenus(type: Product) {
  const menus = await db.menu.findMany({
    where: { published: true, type: type },
    include: { business: { select: { name: true } } },
  });

  return menus;
}
export const getActiveMenus = unstable_cache(
  async (type: Product) => {
    const menus = await db.menu.findMany({
      where: {
        published: true,
        type: type,
        business: {
          OR: [
            {
              subscription: { billing: 'FREETRIAL' },
              menu: { is: { noScans: { lte: 200 } } },
            },
            {
              subscription: {
                billing: { not: 'FREETRIAL' },
                expiresAt: { gte: new Date() },
              },
            },
          ],
        },
      },
      include: { business: { select: { name: true } } },
    });

    return menus;
  },
  ['active-menus'],
  {
    tags: ['active-menus'],
  },
);
export const getActiveMenusNotCached = async (types?: Product[]) => {
  const menus = await db.menu.findMany({
    where: {
      published: true,
      OR: [{ type: types?.[0] }, { type: types?.[1] }, { type: types?.[2] }],
      business: {
        OR: [
          {
            subscription: { billing: 'FREETRIAL' },
            menu: { is: { noScans: { lte: 200 } } },
          },
          {
            subscription: {
              billing: { not: 'FREETRIAL' },
              hasExpired: false,
            },
          },
        ],
      },
    },
    include: { business: { select: { name: true } } },
  });

  return menus;
};

// export const getActiveMenu = cache(
//   async (businessName: string) => {
//     const menu = await db.menu.findFirst({
//       where: {
//         published: true,
//         business: {
//           name: businessName,
//           OR: [
//             {
//               subscription: { billing: "FREETRIAL" },
//               menu: { is: { noScans: { lte: 200 } } },
//             },
//             {
//               subscription: {
//                 billing: { not: "FREETRIAL" },
//                 expiresAt: { gte: new Date() },
//               },
//             },
//           ],
//         },
//       },
//       include: { business: { select: { name: true } } },
//     });

//     console.log("activemenu fetxh")

//     return menu;
//   }
// );

// export const getActiveMenu = cache(
//   async (businessName: string) => {
//     const menu = await db.menu.findFirst({
//       where: {
//         published: true,
//         business: {
//           name: businessName,
//           OR: [
//             {
//               subscription: { billing: "FREETRIAL" },
//               menu: { is: { noScans: { lte: 200 } } },
//             },
//             {
//               subscription: {
//                 billing: { not: "FREETRIAL" },
//                 expiresAt: { gte: new Date() },
//               },
//             },
//           ],
//         },
//       },
//       include: { business: { select: { name: true } } },
//     });

//     console.log("activemenu fetxh")

//     return menu;
//   },
//   ["active-menu"],
//   {
//     tags: ["active-menu"],
//   }
// );
export const getActiveMenuNotCached = async (businessName: string) => {
  const menu = await db.menu.findFirst({
    where: {
      published: true,
      business: {
        name: businessName,
        OR: [
          {
            subscription: { billing: 'FREETRIAL' },
            menu: { is: { noScans: { lte: 200 } } },
          },
          {
            subscription: {
              billing: { not: 'FREETRIAL' },
              hasExpired: false,
            },
          },
        ],
      },
    },
    include: { business: { select: { name: true } } },
  });

  return menu;
};

export async function incrementMenuScans(id: string, businessId: string) {
  const menu = await db.menu.update({
    where: { id },
    data: {
      noScans: {
        increment: 1,
      },
    },
  });

  await db.scan.create({ data: { businessId } });
  revalidateTag(`scans${businessId}`);
  return menu.noScans;
}
export async function deactivateMenu(businessName: string) {
  revalidateTag(`active-menu${businessName}`);
  revalidateTag('active-menus');
  const user = await db.user.findFirst({
    where: {
      business: { some: { name: businessName } },
    },
  });
  if (user) {
    await sendTrialEndedEmail(user.email, user.name, businessName);
  }
}

export async function getMenuByBusinessName(businessName: string) {
  const menu = await db.menu.findFirst({
    where: { business: { name: businessName } },
  });

  return menu;
}
