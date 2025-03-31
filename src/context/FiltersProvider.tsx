"use client"

import { Language } from "@/types"
import { createContext, ReactNode, useContext, useState } from "react"

type thisType = {
    category: string,
    setCategory: React.Dispatch<React.SetStateAction<string>>
    searchQuery: string,
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>,
    languages: string,
    setLanguage: React.Dispatch<React.SetStateAction<string>>,
    language:string
}

export const filtersContext = createContext<thisType | undefined>(undefined)

export function FiltersProvider({children,languages}:{children:ReactNode,languages:string}) {
      const [category, setCategory] = useState("all");
      const [searchQuery, setSearchQuery] = useState("");
      const [language, setLanguage] = useState(languages.split(",")[0]);
    
  return (
    <filtersContext.Provider value={{category,setCategory,searchQuery,setSearchQuery,languages,language,setLanguage}}>
      {children}
    </filtersContext.Provider>
  )
}

export function useFiltersContext() {
  const context = useContext(filtersContext);
  if (context === undefined) {
    throw new Error("useFiltersContext outside provider");
  }

  return context;
}