"use client"

import type { BusinessExtended } from "@/types"
import { createContext, type ReactNode, useContext, useState } from "react"

type thisType = {
    businessName:string
    business:BusinessExtended
}

export const BusinessContext = createContext<thisType | undefined>(undefined)

export function BusinessProvider({children,businessName,business}:{children:ReactNode,businessName:string,business:BusinessExtended}) {
    
  return (
    <BusinessContext.Provider value={{businessName,business}}>
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