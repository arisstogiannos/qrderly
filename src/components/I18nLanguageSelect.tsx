import { usePathname, useRouter } from "@/i18n/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";
import Loader from "./Loader";
import { cn } from "@/lib/utils";

export default function I18nLanguageSelect({className,...props}:React.ComponentProps<"button">) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  
  const [loading, setLoading] = useState(false);
  return (
    <Button
      onClick={() =>{
        setLoading(true);
        router.replace(
            // @ts-expect-error 
          {  params,pathname },

          { locale: params.locale === "en" ? "el" : "en",scroll:true, }
        )}
      }
      className={cn("uppercase bg-foreground max-sm:h-9 max-sm:px-3",className)}
    >
      {loading ? <Loader className="text-xs" /> : params.locale === "en" ? "ελ" : "en"}
    </Button>
  );
}
