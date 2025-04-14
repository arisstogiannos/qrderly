import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import React from "react";

export default async function ChooseUs() {
  const t = await getTranslations("WhyUs");

  return (
    <section className="grid grid-cols-1  lg:grid-cols-[auto_auto] 2xl:grid-cols-2 gap-y-10 sm:pr-20 lg:pr-0 mt-28 lg:mt-0">
      <div className=" space-y-3 lg:max-w-sm xl:max-w-xl">
        <h2 className="font-semibold text-primary md:text-lg 2xl:text-xl">
          {t("title")}
        </h2>
        <p className="text-lg md:text-xl lg:text-2xl text-balance 2xl:text-3xl">
          {t("subtitle")}
        </p>
      </div>
      <ul className="space-y-3 ">
        {[1,2,3,4].map((i)=>(
          
        <ListItem
        key={i}
          title={t("bullets."+i+".title")}
          desc={t("bullets."+i+".subtitle")}
        />
        ))}
       
      </ul>
    </section>
  );
}

function ListItem({ title, desc }: { title: string; desc: string }) {
  return (
    <li className="flex gap-3 ">
      <span className="bg-accent  text-background size-9 lg:size-10 rounded-full p-1 min-w-9 lg:min-w-10  flex-center ">
        <span className="bg-primary text-background size-6 lg:size-7 rounded-full p-1 min-w-6 lg:min-w-7  flex-center ">
          <Check />
        </span>
      </span>
      <div>
        <p className="font-medium text-xl sm:text-2xl lg:text-3xl">{title} </p>
        <p className="text-sm sm:text-base lg:text-xl">{desc}</p>
      </div>
    </li>
  );
}
// export default function ChooseUs() {
//   return (
//     <section className="grid grid-cols-1  lg:grid-cols-2 bg-accent rounded-3xl p-10 gap-y-10">
//       <div className="lg:pr-10 lg:border-r-2 border-r-foreground space-y-5">
//         <h2 className="font-medium text-3xl md:text-4xl lg:text-5xl">What Makes Us Different?</h2>
//         <p className="text-lg md:text-xl lg:text-3xl">
//           We’re the only platform that lets you create, launch, and manage
//           everything on your own—no business or third-party intervention needed.
//         </p>
//       </div>
//       <ul className="space-y-3 lg:pl-10">
//         <ListItem
//           title="Create & Customize Instantly"
//           desc=" Set up your menu in minutes with our easy-to-use interface. No
//             technical skills required."
//         />
//         <ListItem
//           title="No Middleman, No Delays"
//           desc="Unlike other platforms, you have full control over your menu updates, pricing, and customization—whenever you want."
//         />
//         <ListItem
//           title="Seamless Managing"
//           desc="Manage your menu, receive orders, and make instant updates through our powerful admin dashboard."
//         />
//         <ListItem
//           title="Start for Free – No Credit Card Required"
//           desc="Get 200 free scans to test out your menu with no upfront commitment!"
//         />
//       </ul>
//     </section>
//   );
// }

// function ListItem({ title, desc }: { title: string; desc: string }) {
//   return (
//     <li className="flex gap-3 ">
//       <span className="bg-foreground text-background size-6 lg:size-7 rounded-full p-1 min-w-6 lg:min-w-7  flex-center mt-1">
//         <Check />
//       </span>
//       <div>
//         <p className="font-medium text-2xl lg:text-3xl">{title} </p>
//         <p className="lg:text-xl">
//           {desc}
//         </p>
//       </div>
//     </li>
//   );
// }
