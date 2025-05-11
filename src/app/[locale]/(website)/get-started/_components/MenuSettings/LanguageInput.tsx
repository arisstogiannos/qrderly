import { AddLanguageComboBox } from "@/components/ComboBox";
import type { Language } from "@/types";
import { XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LanguageInput({
  languages,
  existingLanguages,
}: {
  languages: readonly Language[];
  existingLanguages?: string;
}) {
  const existingLanguagesArray = existingLanguages?.split(",");
  const defaultLanguage = existingLanguagesArray?.reverse().pop();
  const formatedexistingLanguagesArray = languages.filter((l) =>
    existingLanguagesArray?.some((el) => el === l.code)
  );
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(
    formatedexistingLanguagesArray ?? []
  );
  const [selectedLanguageCodesSerialized, setSelectedLanguageCodesSerialized] =
    useState<string | undefined>(undefined);

  useEffect(() => {
    const serialized = selectedLanguages.map((l) => l.code).join(",");
    setSelectedLanguageCodesSerialized(serialized);
  }, [selectedLanguages]);

  function addLanguage(name: string) {
    const newLanguage = languages.find((l) => l.name === name);

    if (newLanguage && !selectedLanguages.some((l) => l.name === name)) {
      if (selectedLanguages.length < 5) {
        setSelectedLanguages((prev) => [...prev, newLanguage]);
      } else {
        toast.error("You can only add up to 5 languages");
      }
    } else {
      setSelectedLanguages((prev) => prev.filter((l) => l.name !== name));
    }
  }

  function removeLanguage(index: number) {
    setSelectedLanguages((prev) => prev.filter((_, i) => i !== index));
  }
  return (
    <>
      <AddLanguageComboBox
        onSelect={addLanguage}
        list={languages as Language[]}
        valueKey="code"
        labelKey="name"
        selectedLanguages={selectedLanguages.map((l) => l.code)}
      />
      <div className=" flex flex-wrap gap-2">
        {selectedLanguages.map((l, i) => (
          <span
            key={l.name}
            className="rounded-lg bg-accent p-2 w-fit gap-4 flex justify-between items-center text-sm"
          >
            {l.name}
            <button onClick={() => removeLanguage(i)} type="button">
              <XCircle className="size-5  cursor-pointer" />
            </button>
          </span>
        ))}
      </div>
      <input
        type="hidden"
        name="language"
        required
        defaultValue={selectedLanguageCodesSerialized}
      />
    </>
  );
}
