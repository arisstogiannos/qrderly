'use server';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';
import { db } from '@/db';
import { redirect } from '@/i18n/navigation';
import type { CartItem } from '@/types';

export async function submitOrder(
  items: CartItem[],
  businessName: string,
  price: number,
  table: string,
  prev: unknown,
) {
  type CartItemWithoutMenuItem = Omit<CartItem, 'menuItem'> & {
    menuItemId: string;
  };

  const itemsWithoutMenuItem: CartItemWithoutMenuItem[] = items.map(({ menuItem, ...item }) => ({
    ...item,
    menuItemId: menuItem.id,
  }));
  const {
    orders: [order],
    menu,
  } = await db.business.update({
    where: { name: businessName },
    select: {
      orders: { select: { id: true }, orderBy: { createdAt: 'desc' } },
      menu: { select: { type: true } },
    },

    data: {
      orders: {
        create: {
          status: 'PENDING',
          price,
          table: table,
          orderItems: {
            createMany: {
              data: itemsWithoutMenuItem,
            },
          },
        },
      },
    },
  });
  revalidateTag(`orders${businessName}`, 'max');
  const cookieStore = await cookies();
  cookieStore.set(`${businessName}order`, order.id, {
    expires: new Date().setHours(new Date().getHours() + 2),
  });
  cookieStore.set(`${businessName}last-order`, order.id, {
    expires: new Date().setMonth(new Date().getMonth() + 12),
  });
  const locale = await getLocale();
  if (menu?.type === 'SELF_SERVICE_QR_MENU') {
    redirect({
      href: {
        params: { businessName: businessName.replaceAll(' ', '-') },
        pathname: '/[businessName]/smart-menu/order',
        query: { order: order.id },
      },
      locale,
    });
  } else {
    redirect({
      href: {
        params: { businessName: businessName.replaceAll(' ', '-') },
        pathname: '/[businessName]/smart-menu/order-placed',
        query: { order: order.id },
      },
      locale,
    });
  }
}
