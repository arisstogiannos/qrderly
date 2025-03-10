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
    <Accordion type="multiple" >
    {faqData.map((faq) => (
        <AccordionItem key={faq.answer} value={faq.question} className="transition-all duration-1000">
        <AccordionTrigger className="text-xl">{faq.question}</AccordionTrigger>
        <AccordionContent className="text-lg">
          {faq.answer}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
  )
}
