import { ArrowRight } from "lucide-react";
import React from "react";

const cases = [
  "Restaurants & Taverns – Streamline service, reduce wait times, and boost table turnover with digital menus and online ordering.",
  "Cafés & Bars – Let customers order effortlessly from their phones, improving efficiency and reducing staff workload.",
  "Fast Food & Takeaway Spots – Simplify the ordering process with an easy-to-use online system for pickup and delivery.",
  "Hotels & Resorts – Offer guests a seamless in-room dining experience with QR code menus and online orders.",
];

export default function WhoIsThisFor() {
  return (
    <section className="space-y-8 lg:space-y-10 relative">
        
      <h2 className="text-4xl font-medium capitalize md:text-5xl lg:text-6xl">Who is this for?</h2>
      <div className="space-y-6">
        {cases.map((text) => (
          <div key={text} className="flex gap-2">
            <ArrowRight className="w-16"/>
            <p className="md:text-xl lg:text-2xl">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
