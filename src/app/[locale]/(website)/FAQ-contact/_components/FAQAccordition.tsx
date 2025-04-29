import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqData } from "@/data";
import { getTranslations } from "next-intl/server";
import React from "react";
export default async function FAQAccordition() {
  const t = await getTranslations("faq")
  return (
    <Accordion type="single" >
    {[1,2,3,4,5,6,7,8,9,10].map((i) => (
        <AccordionItem key={i} value={t("faq"+(i)+".question")} className=" bg-background rounded-2xl border-0 mb-2 px-4">
        <AccordionTrigger className="text-xl">{t("faq"+(i)+".question")}</AccordionTrigger>
        <AccordionContent className="text-lg">
          {t("faq"+(i)+".answer")}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
  )
}
