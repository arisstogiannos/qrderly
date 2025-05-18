"use client"
import TablesSetup from "@/app/[locale]/(website)/get-started/_components/Business/TablesSetup";
import { Button } from "@/components/ui/button";
import type { BusinessExtended } from "@/types";
import React, { useActionState, useEffect } from "react";
import { saveTables } from "../../../_actions/business";
import Loader from "@/components/Loader";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function TablesForm({
  business,
}: {
  business: BusinessExtended;
}) {
  const [state, action, isPending] = useActionState(
    saveTables.bind(null, business.id),
    null
  );
  const router = useRouter();
  const t = useTranslations("tablesForm");

  useEffect(() => {
    if (state?.success) {
      router.refresh();
      toast.success(t("successDesc"))
    }
  }, [state]);

  return (
    <form className="max-w-xl flex flex-col gap-y-5">
      <p>{t("tables")}</p>
      <TablesSetup initialTables={business.tables?.split(",")} />
      <Button
        disabled={isPending}
        type="submit"
        className="bg-foreground w-fit ml-auto text-lg rounded-full p-1 min-w-24 mt-20"
        formAction={action}
      >
        {isPending ? (
          <Loader />
        ) : (
          <>
            {t("save")} <Save className="size-5" />
          </>
        )}
      </Button>
    </form>
  );
}
