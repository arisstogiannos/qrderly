'use client';
import type { MenuItem } from '@prisma/client';
import { TriangleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { startTransition } from 'react';
import { toast } from 'sonner';
import { useFiltersContext } from '@/context/FiltersProvider';
import type { CategoryWithItemCount, Translation } from '@/types';
import { deleteMenuItem } from '../../../_actions/menu-items';
import MenuCategorySection from './CategoryGroup';

type MenuItemWithCategory = MenuItem & {
  category: {
    name: string;
  };
};

export default function MenuItemsTable({
  menuItems,
  setOptimisticItem,
  businessName,
  categories,
}: {
  menuItems: MenuItemWithCategory[];
  businessName: string;
  setOptimisticItem: (action: {
    newItem: MenuItemWithCategory;
    type: 'delete' | 'add' | 'update';
  }) => void;
  categories: CategoryWithItemCount[];
}) {
  const { searchQuery, category, language, languages } = useFiltersContext();
  const t = useTranslations('admin.menu items');

  function handleDelete(item: MenuItemWithCategory) {
    startTransition(() => {
      setOptimisticItem({ newItem: item, type: 'delete' });
    });
    deleteMenuItem(item.id, businessName).catch(() => {
      toast('Failed to delete item, rolling back...', {
        duration: 2000,
        icon: <TriangleAlert />,
        position: 'bottom-right',
        style: {
          backgroundColor: 'red',
          color: 'darkred',
          borderColor: 'darkred',
        },
      });
    });
  }

  if (!menuItems || menuItems.length === 0) return <p>No items found.</p>;

  const filteredItems = filterItems(menuItems, searchQuery, category, language);

  // Group items by category for the menu-like display
  const groupedItems = filteredItems.reduce(
    (acc, item) => {
      const categoryId = item.categoryId;
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(item);
      return acc;
    },
    {} as Record<string, MenuItemWithCategory[]>,
  );

  // Get unique category IDs that have items
  const categoryIds = Object.keys(groupedItems);

  return (
    <div className="w-full">
      <div className="grid gap-6">
        {categoryIds.map((catId) => {
          const cat = categories.find((c) => c.id === catId);
          if (!cat) return null;

          return (
            <MenuCategorySection
              key={catId}
              items={groupedItems[catId]}
              category={cat}
              language={language}
              languages={languages}
              handleDelete={handleDelete}
              setOptimisticItem={setOptimisticItem}
              categories={categories}
            />
          );
        })}
      </div>
    </div>
  );
}

function filterCategory(items: MenuItemWithCategory[], category: string) {
  return items.filter((item) => item.categoryId === category || category === 'all');
}

function filterSearch(items: MenuItemWithCategory[], query: string, language: string) {
  return items.filter((item) => {
    // Parse translations if they exist
    const translations: Translation | null = item.translations
      ? JSON.parse(item.translations)
      : null;

    // Get translated name and description (fallback to default if missing)
    const translatedName = translations?.[language]?.name || item.name;
    const translatedDescription = translations?.[language]?.description || item.description || '';

    // Check against translated values
    return (
      translatedName.toLowerCase().includes(query.toLowerCase()) ||
      translatedDescription.toLowerCase().includes(query.toLowerCase())
    );
  });
}

function filterItems(
  items: MenuItemWithCategory[],
  query: string,
  category: string,
  language: string,
) {
  let filteredItems = items;
  if (query !== '') {
    filteredItems = filterSearch(filteredItems, query, language);
  }
  if (category !== '') {
    filteredItems = filterCategory(filteredItems, category);
  }

  return filteredItems;
}
