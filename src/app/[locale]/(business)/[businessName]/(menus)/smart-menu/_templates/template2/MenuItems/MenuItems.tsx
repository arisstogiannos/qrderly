import type { Category, MenuItem } from '@prisma/client';
import { Suspense } from 'react';
import CategoryDisplay from '../../../../_components/CateroryDisplay';
import { MenuItemCard } from './MenuItemCard';

export async function MenuItems({
  categories,
  menuItems,
}: {
  categories: Category[];
  menuItems: MenuItem[];
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
            <div key={categoryId} id={categoryId} className="space-y-4 scroll-m-20">
              <CategoryDisplay category={categories.find((c) => c.id === categoryId)} />
              <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                <Suspense>
                  {Object.entries(menuItems).map(([categoryId, product]) => {
                    return <MenuItemCard key={product.id} {...product} />;
                  })}
                </Suspense>
              </div>
            </div>
          ),
      )}
    </div>
  );
}
