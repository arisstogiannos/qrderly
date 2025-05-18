"use client"

import { createContext, type ReactNode, useContext, useState } from "react"

type thisType = {
    open:boolean,
    setOpen:(v:boolean)=>void
}

export const ModalContext = createContext<thisType | undefined>(undefined)

export function ModalProvider({children, open,setOpen}:{children:ReactNode,open:boolean,setOpen:(v:boolean)=>void}) {
    // const [open,setOpen] = useState(false)
    
  return (
    <ModalContext.Provider value={{open,setOpen}}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModalContext() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModalContext outside provider");
  }

  return context;
}