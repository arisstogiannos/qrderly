"use client"

import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const variants = {
  success:"bg-green",
  error:"bg-red",
  normal:""
}

const Toaster = ({ variant = "normal",...props }: ToasterProps&{variant?:"success" | "error" | "normal"}) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className={cn("toaster group",variants[variant])}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
