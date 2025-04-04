import { Category, MenuItem } from "@prisma/client";
import { MenuItemCard } from "./MenuItemCard";
import { Translation } from "@/types";

export async function MenuItems({
  categories,
  menuItems,
  lang
}: {
  categories: Category[];
  menuItems: MenuItem[];
  lang:string
}) {
  const menuItemsByCategory: Record<string, MenuItem[]> = {};
  const categoriess = categories;

  categoriess.forEach((category) => {
    const categoryName = category.id;
    menuItemsByCategory[categoryName] = [];
  });

  menuItems.forEach((product) => {
    menuItemsByCategory[product.categoryId].push(product);
  });

  return (
    <div className="my-container space-y-10 text-foreground min-h-screen">
      {Object.entries(menuItemsByCategory).map(
        ([categoryId, menuItems]) =>
          Object.entries(menuItems).length > 0 && (
            <div key={categoryId} id={categoryId} className="space-y-4 scroll-m-10">
              <p className="text-2xl font-medium capitalize text-primary">
                {categories.find((c) => c.id === categoryId)?.name}
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">

                {Object.entries(menuItems).map(([categoryId, product]) => {
                  const translationsAsJson : Translation | null = product.translations?JSON.parse(product.translations):null
                  
                  const existingTranslation = translationsAsJson&&translationsAsJson[lang]
                  product.name = existingTranslation?translationsAsJson[lang].name:product.name
                  product.description = existingTranslation?(translationsAsJson[lang].description??null):(product.description??null)
                  return <MenuItemCard key={product.id} {...product} />
                })}
              </div>
            </div>
          )
      )}
    </div>
  );
}
