"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { startTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {  MoreVertical, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  deleteCategory,
} from "../../../_actions/categories";
import { Modal } from "../SharedComponents/Modal";
import CategoriesForm from "./CategoriesForm";
import DeleteModal from "../SharedComponents/DeleteModal";
import type {
  CategoryWithItemCount,
  Translation,
} from "@/types";
import { toast } from "sonner";
import { useFiltersContext } from "@/context/FiltersProvider";
import TranslatedCategoryForm from "./TranslatedCategoryForm";

export default function CategoriesTable({
  categories,
  setOptimisticCategory,
  businessName,
}: {
  categories: CategoryWithItemCount[];
  businessName: string;
  setOptimisticCategory: (action: {
    newItem: CategoryWithItemCount;
    type: "delete" | "add" | "update";
  }) => void;
}) {
  const { searchQuery, category, language, languages } = useFiltersContext();
  const filteredCategories = filterItems(
    categories,
    searchQuery,
    category,
    language
  );

  // const { businessName } = useBusinessContext();
  // const {
  //   data: categories,
  //   error,
  //   isLoading,
  // } = useQuery({
  //   queryKey: ["categories", { businessName }],
  //   queryFn: async () => {
  //     const categories = await getCategoriesWithItemCount(businessName);
  //     return categories;
  //   },
  //   staleTime: Infinity,
  // });

  // if (isLoading) return <Loader />;
  if (!categories || categories.length === 0)
    return <div>No Categories Found</div>;

  function handleDelete(item: CategoryWithItemCount) {
    startTransition(() => {
      setOptimisticCategory({ newItem: item, type: "delete" });
    });
    deleteCategory(item.id, businessName).catch(() => {
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
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>noItems</TableHead>

          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredCategories.map((item) => {
          const translationsAsJson: Translation | null = item.translations
            ? JSON.parse(item.translations)
            : null;

          const existingTranslation = translationsAsJson?.[language];

          // ✅ Create a new object instead of mutating item
          const translatedItem = {
            ...item,
            name: existingTranslation &&  existingTranslation.name ? existingTranslation.name : item.name,
          };

          return (
            <TableRow key={translatedItem.id}>
              <TableCell>{translatedItem.name}</TableCell>
              <TableCell>{translatedItem.description}</TableCell>
              <TableCell>
                {translatedItem._count ? translatedItem._count.menuItems : 0}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger className="cursor-pointer">
                    <MoreVertical />
                    <span className="sr-only">Actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {/* <DropdownMenuItem asChild>
                      <a download href={/admin/products/${product.id}/download}></a>
                      </DropdownMenuItem> */}
                    <DropdownMenuItem asChild>
                      <Modal
                        trigger={
                          <Button
                            variant={"ghost"}
                            size={"sm"}
                            className="w-full text-sm px-0"
                          >
                            Edit{" "}
                          </Button>
                        }
                        title="Edit item"
                        subtitle=""
                        classNames="pt-5"
                      >
                        {language === languages.split(",")[0] ? (
                          <CategoriesForm
                            setOptimisticCategory={setOptimisticCategory}
                            item={translatedItem}
                          />
                        ) : (
                          <TranslatedCategoryForm
                            item={translatedItem}
                            language={language}
                            setOptimisticCategory={setOptimisticCategory}
                          />
                        )}
                      </Modal>
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" asChild>
                      {/* <Button
                      variant={"destructive"}
                      className="w-full"
                      onClick={deleteMenuItem.bind(null, item.id)}
                    >
                      Delete
                    </Button> */}
                      <DeleteModal action={handleDelete} item={item} />
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

function filterSearch(
  items: CategoryWithItemCount[],
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
  items: CategoryWithItemCount[],
  query: string,
  category: string,
  language: string
) {
  let filteredItems = items;
  if (query !== "") {
    filteredItems = filterSearch(filteredItems, query, language);
  }

  return filteredItems;
}
