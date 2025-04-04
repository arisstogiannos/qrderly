import { AddLanguageComboBox } from "@/components/ComboBox";
import { Label } from "@/components/ui/label";
import { Language } from "@/types";
import { XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function LanguageInput({
  languages,
  existingLanguages,
}: {
  languages: readonly Language[];
  existingLanguages?:string
}) {

    const existingLanguagesArray = existingLanguages?.split(",")
    const defaultLanguage = existingLanguagesArray?.reverse().pop()
    const formatedexistingLanguagesArray = languages.filter((l)=>existingLanguagesArray?.some((el)=>el===l.code))
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(formatedexistingLanguagesArray ?? []);
  const [selectedLanguageCodesSerialized, setSelectedLanguageCodesSerialized] =
    useState<string | undefined>(undefined);

  useEffect(() => {
    const serialized = selectedLanguages.map((l) => l.code).join(",");
    setSelectedLanguageCodesSerialized(serialized);
  }, [selectedLanguages]);

  function addLanguage(name: string) {
    const newLanguage = languages.find((l) => l.name === name);

    if (newLanguage && !selectedLanguages.some((l) => l.name === name)) {
      setSelectedLanguages((prev) => [...prev, newLanguage]);
    }
  }

  function removeLanguage(index: number) {
    setSelectedLanguages((prev) => prev.filter((_, i) => i !== index));
  }
  return (
    <>
      <div className=" flex flex-wrap gap-2">
        {selectedLanguages.map((l, i) => (
          <span
            key={l.name}
            className="rounded-lg bg-accent p-2 w-fit gap-4 flex justify-between items-center text-sm"
          >
            {l.name}
            <button onClick={() => removeLanguage(i)}>
              <XCircle className="size-5  cursor-pointer" />
            </button>
          </span>
        ))}
      </div>
      <AddLanguageComboBox
        onSelect={addLanguage}
        list={languages as Language[]}
        valueKey="code"
        labelKey="name"
      />
      <input
        type="hidden"
        name="language"
        required
        defaultValue={selectedLanguageCodesSerialized}
      />
    </>
  );
}
