'use server';
import { BillingType, type Product } from '@prisma/client';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import { auth } from '@/auth';
import { productMap } from '@/data';
import { db } from '@/db';
import type { ProductURL } from '@/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function createFreeSubscription(product: ProductURL, businessId: string) {
  const user = (await auth())?.user;

  if (!user?.id) {
    redirect('/sign-up');
  }

  const sub = user.subscriptions.find(
    (s) => s.billing === 'FREETRIAL' && s.product === productMap[product],
  );

  if (!sub) {
    try {
      const subscriptionData = {
        billing: BillingType.FREETRIAL,
        product: productMap[product],
        businessId: businessId !== '' ? businessId : undefined,
      };

      await db.user.update({
        where: { id: user.id },
        select: {
          subscriptions: { orderBy: { purchasedAt: 'desc' }, take: 1 },
        },

        data: {
          subscriptions: {
            upsert: {
              where: {
                businessId_product: {
                  businessId,
                  product: productMap[product],
                },
              },
              create: subscriptionData,
              update: subscriptionData,
            },
          },
        },
      });
    } catch (err) {
      console.error(err);
    }
  }
}

export async function createSession(
  priceId: string,
  billing: BillingType,
  product: Product,
  businessId: string,
  freeSubscriptionId: string,
  successPageLink: string,
  successPageButton: string,
) {
  const user = (await auth())?.user;

  if (!user?.id) redirect('/sign-up');

  // ✅ Generate success URL with session ID placeholder
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const successUrl = `${baseUrl}/payment-successful?session_id={CHECKOUT_SESSION_ID}&successPageLink=${encodeURIComponent(successPageLink)}&successPageButton=${encodeURIComponent(successPageButton)}`;
  const customer = await stripe.customers.list({
    email: user.email ?? '',
    limit: 1,
  });

  const coupon = await stripe.coupons
    .retrieve(process.env.STRIPE_COUPON ?? '')
    .catch((err) => null);

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    automatic_tax: {
      enabled: true,
    },
    metadata: {
      userId: user.id,
      billing,
      email: user.email ?? '',
      product,
      businessId: businessId,
      freeSubscriptionId,
      successPageLink,
      successPageButton,
    },
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl, // ✅ Pass dynamic session ID placeholder
    cancel_url: `${baseUrl}/cancel`,
  };

  if (coupon) {
    sessionParams.discounts = [{ coupon: coupon.id }];
  } else {
    sessionParams.allow_promotion_codes = true;
  }

  // If customer exists, use `customer` field; otherwise, use `customer_email`
  if (customer.data.length > 0) {
    sessionParams.customer = customer.data[0].id;
  } else {
    sessionParams.customer_email = user.email ?? '';
  }
  const session = await stripe.checkout.sessions.create(sessionParams);
  if (session.url) redirect(session.url);
}

// export async function upgradeSubscription({billing}:{billing:BillingType}){

// }
