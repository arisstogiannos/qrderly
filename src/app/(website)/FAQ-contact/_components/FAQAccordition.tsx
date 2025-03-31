import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqData } from "@/data";
import React from "react";
export default function FAQAccordition() {
  return (
    <Accordion type="single" >
    {faqData.map((faq) => (
        <AccordionItem key={faq.answer} value={faq.question} className="transition-all duration-1000 bg-background rounded-2xl border-0 mb-2 px-4">
        <AccordionTrigger className="text-xl">{faq.question}</AccordionTrigger>
        <AccordionContent className="text-lg transition-all duration-1000">
          {faq.answer}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
  )
}
