import React from "react";

import { checkUserAuthorized } from "../../_actions/authorization";
import { cache } from "@/lib/cache";
import {
  getCategories,
  getCategoriesWithItemCount,
} from "../../_actions/categories";
import CategoriesPage from "../_components/Categories/CategoriesPage";
import { FiltersProvider } from "@/context/FiltersProvider";

export default async function page({
  params,
}: {
  params: Promise<{ businessName: string }>;
}) {
  const businessName = (await params).businessName.replaceAll("-", " ");
  const getCategoriesCached = cache(
    getCategoriesWithItemCount,
    ["categories with item count" + businessName],
    { tags: ["categories" + businessName] }
  );

  const categories = await getCategoriesCached(businessName);

  const { business } = await checkUserAuthorized(businessName);

  return (
    <FiltersProvider languages={business.menu?.languages??""}>
      <CategoriesPage categories={categories} businessName={businessName} />
    </FiltersProvider>
  );
}
