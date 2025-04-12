import Background from "@/components/Background";

import React from "react";
import FAQAccordition from "./_components/FAQAccordition";
import ContactForm from "./_components/ContactForm";
import { Button } from "@/components/ui/button";

import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import {setRequestLocale} from 'next-intl/server';
import Link from "next/link";

export const dynamic = "error"
 


export default async function page({params}:{params: Promise<{locale: string}>}) {
  const locale = (await params).locale;
 
  // Enable static rendering
  setRequestLocale(locale);
  const t = await getTranslations("faq")
  return (
    <div className="gap-y-20 flex flex-col mt-20">
      <Background />
      <section className="grid lg:grid-cols-2 grid-rows-[auto_auto] lg:grid-rows-1 xl:mx-28 bg-primary/100 p-4 sm:p-10 gap-10 rounded-3xl ">
      <div className="space-y-5 xl:pr-40">

        <h1 className="text-6xl sm:text-7xl font-semibold leading-20">{t("title")}</h1>
        <p className="text-2xl">{t("subtitle")}</p>
        <Button
            className="text-lg md:text-2xl xl:text-xl rounded-full p-6 px-10 gap-x-4 mt-3 bg-foreground "
            asChild
          >
            <Link  href={{hash:"#contact-form"}} >
              {t("button")} <ArrowRight className="size-6 rotate-90" />
            </Link>
          </Button>
      </div>
        <FAQAccordition />
      </section>
      <section id="contact-form" className="gap-y-2 text-center mx-auto flex flex-col items-center scroll-mt-40">
        <h2 className="text-4xl font-medium">{t("contact")}</h2>
        <p className="text-2xl mb-6 max-w-xl">{t("description")}</p>
        <ContactForm/>
      </section>
    </div>
  );
}
