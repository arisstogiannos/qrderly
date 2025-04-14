"use client";
import { startTransition } from "react";
import { deleteMenuItem } from "../../../_actions/menu-items";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2, Edit, MoreVertical, TriangleAlert } from "lucide-react";
import { Modal } from "../SharedComponents/Modal";
import CloudImage from "@/components/CloudImage";
import { Button } from "@/components/ui/button";
import { useFiltersContext } from "@/context/FiltersProvider";
import MenuItemForm from "./MenuItemForm";
import type { MenuItem } from "@prisma/client";
import DeleteModal from "../SharedComponents/DeleteModal";
import { toast } from "sonner";
import type { CategoryWithItemCount, Translation } from "@/types";
import TranslatedMenuItemForm from "./TranslatedMenuItemForm";
import DisplayPrice from "@/components/DisplayPrice";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    type: "delete" | "add" | "update";
  }) => void;
  categories: CategoryWithItemCount[];
}) {
  const { searchQuery, category, language, languages } = useFiltersContext();
  const t = useTranslations("admin.menu items");

  function handleDelete(item: MenuItemWithCategory) {
    startTransition(() => {
      setOptimisticItem({ newItem: item, type: "delete" });
    });
    deleteMenuItem(item.id, businessName).catch(() => {
      toast("Failed to delete item, rolling back...", {
        duration: 2000,
        icon: <TriangleAlert />,
        position: "bottom-right",
        style: {
          backgroundColor: "red",
          color: "darkred",
          borderColor: "darkred",
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
    {} as Record<string, MenuItemWithCategory[]>
  );

  // Get unique category IDs that have items
  const categoryIds = Object.keys(groupedItems);

  return (
    <div className="w-full">
      {category === "" ? (
        <Tabs defaultValue={categoryIds[0] || "all"} className="w-full">
          <TabsList className="mb-4 flex flex-wrap h-auto">
            {categories.map((cat) => {
              // Only show categories that have items after filtering
              if (!categoryIds.includes(cat.id) && category === "") return null;

              const categoryTranslationsAsJson: Translation | null =
                cat.translations ? JSON.parse(cat.translations) : null;

              const translatedCategoryName =
                categoryTranslationsAsJson?.[language]?.name || cat.name;

              return (
                <TabsTrigger key={cat.id} value={cat.id} className="mb-1">
                  {translatedCategoryName}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((cat) => {
            if (!categoryIds.includes(cat.id)) return null;

            return (
              <TabsContent key={cat.id} value={cat.id} className="mt-0">
                <MenuCategorySection
                  items={groupedItems[cat.id]}
                  category={cat}
                  language={language}
                  languages={languages}
                  handleDelete={handleDelete}
                  setOptimisticItem={setOptimisticItem}
                  categories={categories}
                />
              </TabsContent>
            );
          })}
        </Tabs>
      ) : (
        // When a specific category is selected from the filter
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
      )}
    </div>
  );
}

function MenuCategorySection({
  items,
  category,
  language,
  languages,
  handleDelete,
  setOptimisticItem,
  categories,
}: {
  items: MenuItemWithCategory[];
  category: CategoryWithItemCount;
  language: string;
  languages: string;
  handleDelete: (item: MenuItemWithCategory) => void;
  setOptimisticItem: (action: {
    newItem: MenuItemWithCategory;
    type: "delete" | "add" | "update";
  }) => void;
  categories: CategoryWithItemCount[];
}) {
  const t = useTranslations("admin.menu items");

  const categoryTranslationsAsJson: Translation | null = category.translations
    ? JSON.parse(category.translations)
    : null;

  const translatedCategoryName =
    categoryTranslationsAsJson?.[language]?.name || category.name;

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">{translatedCategoryName}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const translationsAsJson: Translation | null = item.translations
            ? JSON.parse(item.translations)
            : null;

          const existingTranslation = translationsAsJson?.[language];

          const translatedItem = {
            ...item,
            name:
              existingTranslation && existingTranslation.name
                ? existingTranslation.name
                : item.name,
            description: existingTranslation
              ? (existingTranslation.description ?? null)
              : (item.description ?? null),
          };

          return (
            <Card
              id={translatedItem.name}
              className={
                "flex py-2 px-2 flex-row rounded-3xl shadow-none  min-[390px]:min-w-[350px] max-w-full relative  min-h-[100px]  overflow-hidden  text-foreground bg-transparent  transition-all duration-300 lg:min-w-full lg:max-w-full"
              }
            >
              <div className="absolute bottom-2 right-2 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full opacity-80"
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem asChild>
                      <Modal
                        trigger={
                          <Button
                            variant="ghost"
                            className="w-full "
                          >
                            <Edit className="mr-2 h-4 w-4" /> {t("edit")}
                          </Button>
                        }
                        title={language === languages.split(",")[0] ?"Edit item":"Edit item translations"}
                        subtitle=""
                        classNames="pt-5"
                      >
                        {language === languages.split(",")[0] ? (
                          <MenuItemForm
                            categories={categories}
                            item={item}
                            setOptimisticItem={setOptimisticItem}
                          />
                        ) : (
                          <TranslatedMenuItemForm
                            item={translatedItem}
                            setOptimisticItem={setOptimisticItem}
                            language={language}
                          />
                        )}
                      </Modal>
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" asChild>
                      <DeleteModal
                        item={item}
                        action={() => handleDelete(item)}
                      />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="relative max-w-28 min-w-28 min-h-28 max-h-28 rounded-xl overflow-hidden">
                {item.imagePath !== "pending" ? (
                  <CloudImage
                    src={item.imagePath || ""}
                    fill
                    alt={item.name}
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full animate-pulse bg-foreground/40" />
                )}
              </div>
              <CardContent
                className={
                  "flex w-full justify-between gap-2 py-1 px-0 h-full border-0 shadow-none"
                }
              >
                <div className="space-y-1 lg:space-y-1  w-[80%]">
                  <h3 className={"text-base lg:text-lg capitalize line-clamp-2"}>
                    {translatedItem.name}
                  </h3>
                  <p
                    className={
                      "line-clamp-2 text-sm text-muted-foreground lg:text-sm "
                    }
                  >
                    {translatedItem.description}
                  </p>
                </div>
                <span className="lg:text-lg text-foreground">
                  <DisplayPrice price={item.priceInCents} />
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function filterCategory(items: MenuItemWithCategory[], category: string) {
  return items.filter(
    (item) => item.categoryId === category || category === "all"
  );
}

function filterSearch(
  items: MenuItemWithCategory[],
  query: string,
  language: string
) {
  return items.filter((item) => {
    // Parse translations if they exist
    const translations: Translation | null = item.translations
      ? JSON.parse(item.translations)
      : null;

    // Get translated name and description (fallback to default if missing)
    const translatedName = translations?.[language]?.name || item.name;
    const translatedDescription =
      translations?.[language]?.description || item.description || "";

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
  language: string
) {
  let filteredItems = items;
  if (query !== "") {
    filteredItems = filterSearch(filteredItems, query, language);
  }
  if (category !== "") {
    filteredItems = filterCategory(filteredItems, category);
  }

  return filteredItems;
}
