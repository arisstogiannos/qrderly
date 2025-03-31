"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, {
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
} from "react";
import { updateItemTranslation } from "../../../_actions/menu-items";
import { ErrorMessage } from "@/components/Messages";
import Loader from "@/components/Loader";
import { MenuItem } from "@prisma/client";
import { useBusinessContext } from "@/context/BusinessProvider";

import { useModalContext } from "@/context/ModalProvider";
import { getQueryClient } from "../../../../../../../react-query";

import {  MenuItemWithCategory } from "@/types";

export default function TranslatedMenuItemForm({
  item,
  setOptimisticItem,
  language
}: {
  item: MenuItem;
  setOptimisticItem: (action: {
    newItem: MenuItemWithCategory;
    type: "delete" | "add" | "update";
  }) => void;
  language:string
}) {
  const { businessName } = useBusinessContext();
  const [state, action, isPending] = useActionState(
    updateItemTranslation.bind(null, businessName),
    null
  );
  const { setOpen } = useModalContext();

  useEffect(() => {
    if (state?.success) {
      const queryClient = getQueryClient();
      queryClient.invalidateQueries({
        queryKey: ["menu-items"],
      });
    } else {
      setOpen(true);
    }
  }, [state]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    const newItem: MenuItemWithCategory = {
      id: item.id,
      name: (data.name as string) ?? "",
      description: (data.description as string) || null, 
      priceInCents: Number(data.priceInCents) || 0,
      categoryId: data.categoryId as string,
      menuId: data.menuId as string,
      isAvailable: true, 
      createdAt: new Date(),
      updatedAt: new Date(),
      category: { name: data.category as string }, 
      preferences: (data.preferences as string) || null, 
      translations: (data.translations as string) || null, 
      imagePath: "pending", 
      stock: null, 
    };
    startTransition(() => {
      setOptimisticItem({ newItem, type:  "update" });
    });
    setOpen(false);
  }

  return (
    <form
      action={action}
      className="space-y-5 max-w-xl max-h-[80vh] overflow-y-auto "
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          name="name"
          id="name"
          required
          defaultValue={item?.name || state?.data?.name}
          minLength={1}
          maxLength={100}
          pattern="[^_]*" // Disallows "_"
          title="Underscore (_) is not allowed"
          placeholder="Enter the menu items name"
        />
        {state?.errors?.name?.map((er) => {
          return (
            <ErrorMessage
              key={er}
              classNames="text-sm bg-transparent p-0 "
              msg={er}
            />
          );
        })}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          name="description"
          id="description"
          defaultValue={
            (item?.description || state?.data?.description) ?? undefined
          }
          required
          minLength={1}
          maxLength={100}
          placeholder="Enter the menu items description"
        />

        {state?.errors?.description?.map((er) => {
          return (
            <ErrorMessage
              key={er}
              classNames="text-sm bg-transparent p-0 "
              msg={er}
            />
          );
        })}
      </div>

      <input type="text" name="id" defaultValue={item.id} hidden />
      <input type="text" name="language" defaultValue={language} hidden />
      <input type="text" name="translations" defaultValue={item.translations ?? undefined} hidden />
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader /> : "Save"}
      </Button>
      {state?.error ? <ErrorMessage msg={state.error} /> : null}
    </form>
  );
}
