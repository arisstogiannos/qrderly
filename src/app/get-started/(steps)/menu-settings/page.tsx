import React from "react";
import MenuSettingsForm from "../../_components/MenuSettingsForm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";

export default async function page() {
  const result = await hasValidSubscription();
  if (result === null) {
    console.log(result);
    return <div>Create a business first</div>;
  }
  return (
    <section className="space-y-8">
      <h1 className="text-2xl font-medium">Menu Settings</h1>
      <MenuSettingsForm
        businessId={result.businessId}
        subscriptionId={result.subId}
      />
    </section>
  );
}

//unfinished

async function hasValidSubscription(): Promise<{
  businessId: string;
  subId: string;
} | null> {
  const session = await auth();
  const user = await db.user.findUnique({
    where: { id: session?.user.id },
    include: {
      business: {
        select: { id: true, subscriptions: true, menu: true },
      },
    },
  });

  if (!user) {
    redirect("/unauthorized?msg=You need to login to access this page.");
  }

  for (const b of user.business) {
    if (!b.menu) {
      return { businessId: b.id, subId: "ss" };
    }
  }
  // user.business.forEach((b) => {
  //   // b.subscriptions.forEach((s) => {
  //   if (!b.menu) {
  //     console.log("hi")
  //     return { businessId: b.id, subId: "ss" };
  //   }
  // });
  // });
  return null;
  // if (!isAllowed) {
  //   redirect("/unauthorized?msg=You have no subscription with unset businesses.")
  // }
}
