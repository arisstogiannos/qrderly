import Background from "@/components/Background";

import React from "react";
import FAQAccordition from "./_components/FAQAccordition";
import ContactForm from "./_components/ContactForm";

export default function page() {
  return (
    <div className="space-y-20 mt-20">
      <Background />
      <section className="space-y-10">
        <h1 className="text-4xl font-medium">FAQ</h1>
        <FAQAccordition />
      </section>
      <section className="space-y-2">
        <h2 className="text-4xl font-medium">Contact</h2>
        <p className="text-2xl mb-6 max-w-lg">Feel free to reach out to us for any questions and we will get back to you as soon as possible!</p>
        <ContactForm/>
      </section>
    </div>
  );
}
