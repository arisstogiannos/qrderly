"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import React, { startTransition } from "react";
import { deleteMenuItem } from "../../../_actions/menu-items";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2, MoreVertical } from "lucide-react";
import { useBusinessContext } from "@/context/BusinessProvider";
import { Button } from "@/components/ui/button";
import {
  deleteCategory,
  getCategories,
  getCategoriesWithItemCount,
} from "../../../_actions/categories";
import Loader from "@/components/Loader";
import { Modal } from "../Modal";
import CategoriesForm from "./CategoriesForm";
import DeleteModal from "../DeleteModal";
import { CategoryWithItemCount, MenuItemWithCategory } from "@/types";
import { toast } from "sonner";

export default function CategoriesTable({
  categories,
  setOptimisticCategory,
  businessName
}: {
  categories: CategoryWithItemCount[];
  businessName: string;
  setOptimisticCategory: (action: {
    newItem: CategoryWithItemCount;
    type: "delete" | "add" | "update";
  }) => void;
}) {
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
    deleteCategory(item.id,businessName).catch(() => {
      toast("Failed to delete item, rolling back...");
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
        {categories.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>{item._count ? item._count.menuItems : 0}</TableCell>
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
                    >
                      <CategoriesForm
                        setOptimisticCategory={setOptimisticCategory}
                        item={item}
                      />
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
        ))}
      </TableBody>
    </Table>
  );
}
