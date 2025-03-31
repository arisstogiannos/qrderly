"use client"

import { createContext, ReactNode, useContext, useState } from "react"

type thisType = {
    open:boolean,
    setOpen:(v:boolean)=>void
}

export const CardModalContext = createContext<thisType | undefined>(undefined)

export function CardModalProvider({children}:{children:ReactNode}) {
    const [open,setOpen] = useState(false)
    
  return (
    <CardModalContext.Provider value={{open,setOpen}}>
      {children}
    </CardModalContext.Provider>
  )
}

export function useCardModalContext() {
  const context = useContext(CardModalContext);
  if (context === undefined) {
    throw new Error("useCardModalContext outside provider");
  }

  return context;
}