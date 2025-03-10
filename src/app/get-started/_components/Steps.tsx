"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

export default function Steps() {
    const steps = ["business setup", "menu settings", "generate QR"];
    const pathname = usePathname()
    
  return (
    <div className="flex gap-14 sm:gap-20 relative w-fit h-fit mx-auto">
        <hr className="absolute w-[80%] left-1/2 -translate-x-1/2 top-3/4 md:top-2/3 border-foreground border-2 -z-10" />
        {steps.map((step, i) => (
          <Link href={`/get-started/${step.replace(" ","-")}`} key={i} className="flex flex-col items-center gap-1">
            <p className='text-sm text-center sm:text-lg capitalize'>{step}</p>
            <span className={`flex-center  size-8 rounded-full border-2 border-foreground ${pathname.includes(step.replace(" ","-"))?"bg-foreground text-background":"bg-background text-foreground"}`}>
              {i + 1}
            </span>
          </Link>
        ))}
      </div>
  )
}
