"use server";
import { getMenuItemsByMenuId } from "@/app/[locale]/(business)/[businessName]/_actions/menu-items";
import { auth } from "@/auth";
import { productMap } from "@/data";
import { cache } from "@/lib/cache";
import type { BusinessExtended, ExtendedUser, ProductURL } from "@/types";
import { redirect } from "next/navigation";

export async function checkUser(product: ProductURL): Promise<{
  business: BusinessExtended;
  redirect:
    | "businessWithoutMenu"
    | "unpublishedMenu"
    | "noUnsetBusiness"
    | "emptyMenu"
    | "noQR";
  user: ExtendedUser;
} | null> {
  const session = await auth();

  const user = session?.user;

  if (!user) {
    redirect("/unauthorized?msg=You need to login to access this page.");
  }

  const businesses = user.business.filter(
    (b) => b.product === productMap[product]
  );

  if (businesses.length === 0) {
    return null;
  }

  for (const b of businesses) {
    if (!b.menu) {
      return { business: b, redirect: "businessWithoutMenu", user };
    }
    if (!b.menu.published) {
      const getMenuItemsByMenuIdCached = cache(
        getMenuItemsByMenuId,
        [`generate-items${b.name}`],
        { tags: [`generate-items${b.name}`] }
      );
      const menuItems = await getMenuItemsByMenuIdCached(b.menu.id);

      if (menuItems.length === 0)
        return { business: b, redirect: "emptyMenu", user };

      // if (!b.qr) {
      //   return { business: b, redirect: "noQR", user };
      // }

      return { business: b, redirect: "unpublishedMenu", user };
    }
  }

  const publishedBusinesses = businesses.filter((b) => b.menu?.published);

  const latestBusiness = publishedBusinesses.reduce((latest, business) =>
    business.subscription &&
    business.subscription.purchasedAt > (latest?.subscription?.purchasedAt ?? 0)
      ? business
      : latest
  );

  return { business: latestBusiness, redirect: "noUnsetBusiness", user };
}

