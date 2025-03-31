import React from "react";

import { checkUserAuthorized } from "../../_actions/authorization";
import { cache } from "@/lib/cache";
import { getCategories, getCategoriesWithItemCount } from "../../_actions/categories";
import CategoriesPage from "../_components/Categories/CategoriesPage";

export default async function page({
  params,
}: {
  params: Promise<{ businessName: string }>;
}) {
  const businessName = (await params).businessName.replaceAll("-"," ");
  const getCategoriesCached = cache(getCategoriesWithItemCount,["categories"+businessName],{tags:["categories"+businessName]})

  const categories = await getCategoriesCached(businessName)

  await checkUserAuthorized(businessName);

  return (
   <CategoriesPage categories={categories} businessName={businessName} />
  );
}
