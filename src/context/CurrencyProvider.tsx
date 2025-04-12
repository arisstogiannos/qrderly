"use client"

import { createContext, ReactNode, useContext } from "react"

type thisType = {
    currency:string
}

export const CurrencyContext = createContext<thisType | undefined>(undefined)

export function CurrencyProvider({children,currency}:{children:ReactNode,currency:string}) {
    
  return (
    <CurrencyContext.Provider value={{currency}}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrencyContext() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrencyContext outside provider");
  }

  return context;
}