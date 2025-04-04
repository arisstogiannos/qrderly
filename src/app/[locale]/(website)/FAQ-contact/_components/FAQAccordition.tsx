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
    {faqData.map((faq,i) => (
        <AccordionItem key={faq.answer} value={t("faq"+(i+1)+".question")} className=" bg-background rounded-2xl border-0 mb-2 px-4">
        <AccordionTrigger className="text-xl">{t("faq"+(i+1)+".question")}</AccordionTrigger>
        <AccordionContent className="text-lg">
          {t("faq"+(i+1)+".answer")}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
  )
}
