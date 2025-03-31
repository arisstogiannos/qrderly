"use client"

import { createContext, ReactNode, useContext, useState } from "react"

type thisType = {
    businessName:string
}

export const BusinessContext = createContext<thisType | undefined>(undefined)

export function BusinessProvider({children,businessName}:{children:ReactNode,businessName:string}) {
    
  return (
    <BusinessContext.Provider value={{businessName}}>
      {children}
    </BusinessContext.Provider>
  )
}

export function useBusinessContext() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error("useBusinessContext outside provider");
  }

  return context;
}