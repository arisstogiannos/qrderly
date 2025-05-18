"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Filters from "../SharedComponents/Filters";
import { Modal } from "../SharedComponents/Modal";
import MenuItemForm from "./MenuItemForm";
import MenuItemsTable from "./MenuItemsTable";
import type { CategoryWithItemCount, MenuItemWithCategory } from "@/types";
import { useOptimistic } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";

export default function MenuItemsPage({
  menuItems,
  businessName,
  categories,
}: {
  menuItems: MenuItemWithCategory[];
  businessName: string;
  categories: CategoryWithItemCount[];
}) {
  const [optimisticItems, setOptimisticItem] = useOptimistic(
    menuItems ?? [],
    (
      state,
      action: {
        newItem: MenuItemWithCategory;
        type: "delete" | "add" | "update";
      }
    ) => {
      if (action.type === "add") {
        return [...state, action.newItem];
      } else if (action.type === "delete") {
        return state.filter((item) => item.id !== action.newItem.id);
      } else if (action.type === "update") {
        const itemToUpdate = state.find(
          (item) => item.id === action.newItem.id
        );
        if (itemToUpdate) {
          return state.map((item) =>
            item.id === action.newItem.id ? action.newItem : item
          );
        }
      }
      return state;
    }
  );
  const t = useTranslations("admin.menu items");
  return (
    <section className="xl:space-y-20 space-y-8">
      <div className="flex justify-between lg:flex-row flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-medium text-2xl">{t("title")}</h1>
          <SidebarTrigger className="lg:absolute top-3 left-2" />
        </div>
        <div className="md:flex lg:gap-10 gap-4 contents">
          <Filters />
          <Modal
            trigger={
              <Button type="button">
                {t("add")} <Plus />
              </Button>
            }
            title={t("add new item")}
            subtitle=""
            classNames="pt-5  "
          >
            <MenuItemForm
              categories={categories}
              setOptimisticItem={setOptimisticItem}
            />
          </Modal>
        </div>
      </div>
      <MenuItemsTable
        categories={categories}
        businessName={businessName}
        menuItems={optimisticItems}
        setOptimisticItem={setOptimisticItem}
      />
    </section>
  );
}
