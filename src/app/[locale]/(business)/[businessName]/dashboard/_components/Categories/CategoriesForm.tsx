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
import { getQueryClient } from "../../../../../../../../react-query";
import { upsertCategory } from "../../../_actions/categories";
import TranslateCheckBox from "../TranslateCheckBox";
import { CategoryWithItemCount } from "@/types";
import { useTranslations } from "next-intl";

export default function CategoriesForm({
  item,
  setOptimisticCategory,
}: {
  item?: Category;
  setOptimisticCategory: (action: {
    newItem: CategoryWithItemCount;
    type: "delete" | "add" | "update";
  }) => void;
}) {
  const t = useTranslations("categoriesForm");
  const { businessName } = useBusinessContext();
  const [state, action, isPending] = useActionState(
    upsertCategory.bind(null, businessName),
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
      id: item?.id ?? crypto.randomUUID(), // Temporary ID
      name: (data.name as string) ?? "",
      description: (data.description as string) || null, // Ensuring nullable
      menuId: "",
      translations: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: { menuItems: 0 },
    };
    startTransition(() => {
      setOptimisticCategory({ newItem, type: item ? "update" : "add" });
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
        <Label htmlFor="name">{t("name")}</Label>
        <Input
          name="name"
          id="name"
          required
          defaultValue={item?.name || state?.data?.name}
          minLength={1}
          maxLength={100}
          placeholder={t("namePlaceholder")}
        />
        <TranslateCheckBox name="translateName" />
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
        <Label htmlFor="description">
          {t("description")}{" "}
          <span className="text-muted-foreground">({t("optional")})</span>
        </Label>
        <p className="text-muted-foreground text-sm">{t("descriptionHint")}</p>
        <Input
          name="description"
          id="description"
          defaultValue={
            (item?.description || state?.data?.description) ?? undefined
          }
          minLength={1}
          maxLength={100}
          placeholder={t("descriptionPlaceholder")}
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
      {item && <input type="text" name="id" defaultValue={item.id} hidden />}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader /> : t("save")}
      </Button>
      {state?.error ? <ErrorMessage msg={state.error} /> : null}
    </form>
  );
}
