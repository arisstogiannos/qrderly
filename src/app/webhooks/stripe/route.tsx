import { plandata } from "@/data";
import { db } from "@/db";
import PurchaseReceiptEmail from "@/email/components/orders/PurchaseReceipt";
import { BillingType, Product } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: NextRequest) {
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  if (event.type === "checkout.session.completed") {
    const session = await stripe.checkout.sessions.retrieve(
      event.data.object.id,
      {
        expand: ["line_items", "customer", "subscription"],
      }
    );
    const userId = session.metadata?.userId;
    const product = session.metadata?.product as Product;
    const billing = session.metadata?.billing as BillingType;
    const email = session.metadata?.email;
    const businessId = session.metadata?.businessId ?? "";
    const subToUpgrade = session.metadata?.freeSubscriptionId ?? "";

    if (!userId || !billing || !product || !email) {
      return new NextResponse("Bad Request: Missing Metadata", { status: 400 });
    }

    const currentDate = new Date();
    const expireDate =
      billing === "MONTHLY"
        ? new Date(currentDate.setMonth(currentDate.getMonth() + 1))
        : new Date(currentDate.setFullYear(currentDate.getFullYear() + 1));

    const subscriptionId =
      typeof session.subscription === "object"
        ? session.subscription?.id
        : session.subscription;
    const subscriptionData = {
      userId: userId,
      billing: billing,
      product: product,
      businessId: businessId !== "" ? businessId : null,
      expiresAt: expireDate,
      stripeSubId: subscriptionId,
      hasExpired: false,
    };

    let query;

    if (subToUpgrade !== "") {
      query = { id: subToUpgrade };
    } else {
      query = { businessId_product: { businessId, product } };
    }

    const sub = await db.subscription.upsert({
      where: query,
      include: { business: true },
      create: subscriptionData,
      update: subscriptionData,
    });

    // const {
    //   subscriptions: [sub],
    // } = await db.user.update({
    //   where: { id: userId },
    //   select: { subscriptions: {include:{business:true}, orderBy: { purchasedAt: "desc" }, take: 1 } },

    //   data: {
    //     subscriptions: {
    //       upsert: {
    //         where: query,
    //         create: subscriptionData,
    //         update: subscriptionData,
    //       },
    //     },
    //   },
    // });

    revalidateTag("active-menu" + sub?.business?.name);

    await resend.emails.send({
      from: `Aris <${process.env.SENDER_EMAIL as string}>`,
      to: email,
      subject: "Order Confirmation",
      react: <PurchaseReceiptEmail sub={sub} />,
    });
  } else if (event.type === "customer.subscription.deleted") {
    const subscription = await stripe.subscriptions.retrieve(
      event.data.object.id,
      {
        expand: ["customer"],
      }
    );
    const sub = await db.subscription.update({
      where: {
        stripeSubId: subscription.id,
      },
      data: { hasExpired: true },
      select: { business: true },
    });

    revalidateTag("active-menu" + sub?.business?.name);
  } else if (event.type === "customer.subscription.updated") {
    const updatedSub = event.data.object;
    const newPlan = updatedSub.items.data[0].plan;
    console.log(updatedSub.items.data[0].plan.id);
    const newSubProduct = plandata.find(
      (plan) =>
        plan.billing[newPlan.interval === "month" ? "monthly" : "yearly"]
          .price_id === newPlan.id
    );
    if (newSubProduct) {
      const sub = await db.subscription.update({
        where: { stripeSubId: updatedSub.id },
        data: {
          billing: newPlan.interval === "month" ? "MONTHLY" : "YEARLY",
          product: newSubProduct.product,
          purchasedAt:new Date(),
          renewedAt:new Date(),
          business:{update:{product:newSubProduct.product,menu:{update:{type:newSubProduct.product}}}}
        },
        select:{business:{select:{name:true}}}
      });
      revalidateTag("active-menu" + sub?.business?.name);
    }

    // Get the current period end to set the new expiration date
    const newExpireDate = new Date(updatedSub.current_period_end * 1000); // Stripe returns seconds
  }

  return new NextResponse();
}

// const customerId = session?.customer;
// if(!customerId) {
//   return new NextResponse("Bad Request", { status: 400 });
// }
// const customer = await stripe.customers.retrieve(customerId.toString())
// const email = (customer as Stripe.Customer).email;

// if (!email) {
//   return new NextResponse("Bad Request: Missing Customer Email", { status: 400 });
// }

// const priceId = session.line_items?.data[0].price?.id
// console.log(priceId)

// const planMonthly = plandata.find((plan)=> plan.billing.monthly.price_id === priceId)
// const planYearly = plandata.find((plan)=> plan.billing.yearly.price_id === priceId)

// let subscriptionData ;

// if(planMonthly){
//   subscriptionData = {

//     billing:BillingType.MONTHLY,
//     product:productMap[planMonthly.title.replaceAll(" ","-").toLowerCase() as ProductURL]
//   }
// }else if(planYearly){
//   subscriptionData = {

//     billing:BillingType.YEARLY,
//     product:productMap[planYearly.title.replaceAll(" ","-").toLowerCase() as ProductURL]
//   }
// }
