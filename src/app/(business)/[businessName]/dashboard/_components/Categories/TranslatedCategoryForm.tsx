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
import { ErrorMessage } from "@/components/Messages";
import Loader from "@/components/Loader";
import { Category } from "@prisma/client";
import { useBusinessContext } from "@/context/BusinessProvider";

import { useModalContext } from "@/context/ModalProvider";
import { getQueryClient } from "../../../../../../../react-query";
import { updateTranslationCategory, upsertCategory } from "../../../_actions/categories";
import TranslateCheckBox from "../TranslateCheckBox";
import { CategoryWithItemCount } from "@/types";

export default function TranslatedCategoryForm({
  item,
  setOptimisticCategory,
  language
}: {
  item: Category;
  setOptimisticCategory: (action: {
    newItem: CategoryWithItemCount;
    type: "delete" | "add" | "update";
  }) => void;
  language:string

}) {
  const { businessName } = useBusinessContext();
  const [state, action, isPending] = useActionState(
    updateTranslationCategory.bind(null, businessName),
    null
  );
  const { setOpen } = useModalContext();
  useEffect(() => {
    if (state?.success) {
      const queryClient = getQueryClient();
      queryClient.invalidateQueries({
        queryKey: ["categories", { businessName }],
      });
      // setOpen(false);
    }
  }, [state]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    const newItem: CategoryWithItemCount = {
      id: item.id??crypto.randomUUID(), // Temporary ID
      name: (data.name as string) ?? "",
      description: (data.description as string) || null, // Ensuring nullable
      menuId: "",
      translations: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: { menuItems: 0 },
    };
    startTransition(() => {
      setOptimisticCategory({ newItem, type:"update" });
    });
    setOpen(false);
  }

  return (
    <form
      action={action}
      className="space-y-5 max-w-xl max-h-[80vh] overflow-y-auto"
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          name="name"
          id="name"
          required
          defaultValue={ state?.data?.name || item.name }
          minLength={1}
          maxLength={100}
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
