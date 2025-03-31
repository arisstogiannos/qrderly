"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React, { useActionState } from "react";
import { submitMenuSettings } from "../../actions";
import {  ProductURL } from "@/types";
import Loader from "@/components/Loader";
import { useSearchParams } from "next/navigation";
import { Menu, Product, Template } from "@prisma/client";
import TemplateSelect from "./TemplateSelect";
import LanguageSettings from "./LanguageSettings";
import ThemeSettings from "./ThemeSettings";
import { Language } from "deepl-node";

export default function MenuSettingsForm({
  businessId,
  product,
  menu,
  srcLanguages,
  targetLanguages,
}: {
  srcLanguages: readonly Language[];
  targetLanguages: readonly Language[];
  businessId: string;
  product: Product;
  menu?: Menu;
}) {
  const [state, action, isPending] = useActionState(
    submitMenuSettings.bind(null, businessId, product,menu),
    null
  );
  const template: Template = (useSearchParams().get("t") as Template) ?? "T1";

  return (
    <>
      <TemplateSelect
        template={template}
        menu={menu}
        errors={state?.errors?.template}
      />
      <LanguageSettings
        srcLanguages={srcLanguages}
        targetLanguages={targetLanguages}
        menu={menu}
        errors={state?.errors?.language}
      />
      <ThemeSettings
        menu={menu}
        template={template}
        errors={state?.errors?.theme}
      />
      <Button
        disabled={isPending}
        type="submit"
        className="bg-foreground w-fit ml-auto text-lg rounded-full p-1 min-w-24 mt-auto"
        formAction={action}
      >
        {isPending ? (
          <Loader />
        ) : menu ? (
          "Save"
        ) : (
          <>
            Next <ArrowRight className="size-5" />
          </>
        )}
      </Button>
    </>
  );
}
