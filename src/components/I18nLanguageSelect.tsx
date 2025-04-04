import { usePathname, useRouter } from "@/i18n/navigation";
import React from "react";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";

export default function I18nLanguageSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  return (
    <Button
      onClick={() =>
        router.replace(
          { pathname },
          { locale: params.locale === "en" ? "el" : "en" }
        )
      }
      className="uppercase bg-foreground max-sm:px-3"
    >
      {params.locale === "en" ? "el" : "en"}
    </Button>
  );
}
