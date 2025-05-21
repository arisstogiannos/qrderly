"use client";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import React from "react";

export default function BackButton() {
  const t = useTranslations("menus.order");
  return (
    <Button onClick={() => history.back()} className="mt-5 w-full rounded-2xl py-6 text-lg">
      {t("backToMenu")}
    </Button>
  );
}
