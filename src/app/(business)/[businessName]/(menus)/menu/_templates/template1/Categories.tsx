"use client";
import { Translation } from "@/types";
import { Category } from "@prisma/client";
import { useEffect, useRef, useState } from "react";

export default function Categories({
  categories,
  lang,
}: {
  categories: Category[];
  lang: string;
}) {
  const [currentCategory, setCurrentCategory] = useState(
    categories.at(0)?.name
  );
  const linksRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});
  const isUserClicking = useRef(false); // Prevent scroll effect on click

  useEffect(() => {
    categories.forEach(
      (cat) => (sectionsRef.current[cat.id] = document.getElementById(cat.id))
    );

    const handleScroll = () => {
      if (isUserClicking.current) return; // Prevent auto-scroll when user clicks

      const visibleCategory = categories.find((category) => {
        const section = sectionsRef.current[category.id];
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return (
          rect.top <= window.innerHeight / 2 &&
          rect.bottom >= window.innerHeight / 2
        );
      });

      if (visibleCategory) {
        setCurrentCategory(visibleCategory.name);

        // Scroll the category button into view only when user is scrolling
        linksRef.current[visibleCategory.name]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories, currentCategory]);

  function handleClick(category: string) {
    isUserClicking.current = true; // Mark as user click
    setCurrentCategory(category);
    sectionsRef.current[category]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // Re-enable auto-scroll after a delay
    setTimeout(() => {
      isUserClicking.current = false;
    }, 500);
  }

  return (
    <div className="sticky top-0 z-10  bg-background/70 font-medium text-foreground backdrop-blur-2xl lg:pt-[100px]">
      <div className="scrollbar-hidden my-container flex items-center gap-4 overflow-auto py-4 text-lg capitalize lg:gap-7 ">
        <p className="hidden lg:block lg:text-3xl">Categories</p>

        {categories.map((category) => {
          const translationsAsJson: Translation | null = category.translations
            ? JSON.parse(category.translations)
            : null;

          const existingTranslation =
            translationsAsJson && translationsAsJson[lang];
          category.name =
            existingTranslation && translationsAsJson[lang].name
              ? translationsAsJson[lang].name
              : category.name;
          category.description =
            existingTranslation && translationsAsJson[lang].description
              ? translationsAsJson[lang].description
              : category.description;

          return (
            <button
              key={category.id}
              ref={(el) => {
                if (el) linksRef.current[category.id] = el;
              }}
              className={`rounded-full text-nowrap px-5 py-2 text-sm font-medium capitalize transition-colors lg:text-base xl:hover:bg-primary ${
                currentCategory === category.name
                  ? "bg-primary"
                  : "bg-primary/30"
              }`}
              onClick={() => handleClick(category.id)}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
