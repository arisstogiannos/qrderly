"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { startTransition, useOptimistic } from "react";
import { deleteMenuItem } from "../../../_actions/menu-items";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2, Edit, MoreVertical, TriangleAlert } from "lucide-react";
import { Modal } from "../Modal";
import CloudImage from "@/components/CloudImage";
import { Button } from "@/components/ui/button";
import { useFiltersContext } from "@/context/FiltersProvider";
import MenuItemForm from "./MenuItemForm";
import { MenuItem } from "@prisma/client";
import DeleteModal from "../DeleteModal";
import { toast } from "sonner";
import { CategoryWithItemCount, Translation } from "@/types";
import TranslatedMenuItemForm from "./TranslatedMenuItemForm";
import DisplayPrice from "@/components/DisplayPrice";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("admin.menu items")

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
  return (
    <Table className="text-base">
      <TableHeader>
        <TableRow>
          <TableHead className="max-sm:hidden">
            {t("status")}
            <span className="sr-only">Available for Purchase</span>
          </TableHead>
          <TableHead>{t("image")}</TableHead>
          <TableHead>{t("name")}</TableHead>
          <TableHead className="max-[410px]:hidden">{t("category")}</TableHead>
          <TableHead>{t("price")}</TableHead>

          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredItems.map((item) => {
          const translationsAsJson: Translation | null = item.translations
            ? JSON.parse(item.translations)
            : null;

          const existingTranslation = translationsAsJson?.[language];

          // ✅ Create a new object instead of mutating item
          const translatedItem = {
            ...item,
            name: existingTranslation && existingTranslation.name ? existingTranslation.name : item.name,
            description: existingTranslation
              ? (existingTranslation.description ?? null)
              : (item.description ?? null),
          };

          const category = categories?.find((c) => c.id === item.categoryId);
          let translatedCategoryName = category?.name;

          if (category) {
            const categoryTranslationsAsJson: Translation | null =
              category.translations ? JSON.parse(category.translations) : null;

            translatedCategoryName =
              categoryTranslationsAsJson?.[language]?.name || category.name;
          }
          return (
            <TableRow key={item.id}>
              <TableCell className="max-sm:hidden">
                <CheckCircle2 />
              </TableCell>
              <TableCell>
                <div className="relative aspect-auto size-14 overflow-hidden rounded-lg">
                  {item.imagePath !== "pending" ? (
                    <CloudImage
                      src={item.imagePath || ""}
                      fill
                      alt={item.name}
                      className="aspect-auto object-cover"
                    />
                  ) : (
                    <div className="aspect-auto object-fill size-full animate-pulse bg-foreground/40" />
                  )}
                </div>
              </TableCell>
              <TableCell className="truncate max-w-32 sm:max-w-80">{translatedItem.name}</TableCell>
              <TableCell className="max-[410px]:hidden">
                {translatedCategoryName}
              </TableCell>
              <TableCell><DisplayPrice price={item.priceInCents}/></TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger className="cursor-pointer">
                    <MoreVertical />
                    <span className="sr-only">Actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-20">
                    <DropdownMenuItem asChild>
                      <Modal
                        trigger={
                          <Button
                            variant={"ghost"}
                            size={"sm"}
                            className="w-full text-sm px-0 py-4"
                          >
                            <Edit /> {t("edit")}
                          </Button>
                        }
                        title="Edit item"
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
                      <DeleteModal item={item} action={handleDelete} />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
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
      // item.category.name.toLowerCase().includes(query.toLowerCase()) ||
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
