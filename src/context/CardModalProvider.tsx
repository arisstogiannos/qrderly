"use client"

import { createContext, ReactNode, useContext, useState } from "react"

type thisType = {
    open:boolean,
    setOpen:(v:boolean)=>void,
    price:number,
    setPrice: React.Dispatch<React.SetStateAction<number>>;
}

export const CardModalContext = createContext<thisType | undefined>(undefined)

export function CardModalProvider({children}:{children:ReactNode}) {
    const [open,setOpen] = useState(false)
    const [price,setPrice] = useState(0)
    
  return (
    <CardModalContext.Provider value={{open,setOpen,price,setPrice}}>
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