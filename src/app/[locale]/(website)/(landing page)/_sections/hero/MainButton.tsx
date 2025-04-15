import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import React from 'react';

export  function MainButton({
  className,
  children,
  asChild = false,
  ...props
}: React.ComponentProps<"button">&{asChild?:boolean}) {

  const Comp = asChild ? Slot : "button"

  return (
        <button {...props} className={cn(" inline-block p-px font-medium leading-6 text-background hover:text-primary bg-foreground shadow-lg cursor-pointer rounded-2xl  shadow-primary/70 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-primary relative group",className)}>
          <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-cyan-500 to-sky-600 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="relative z-10 block px-6 py-3 rounded-2xl bg-inherit">
            <div className="relative z-10 flex items-center space-x-3">
              <span className="transition-all duration-500 group-hover:translate-x-1.5  flex gap-4 w-full items-center">{children}</span>
              {/* <span className="transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-primary">Get Started For Free</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-primary">
                <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
              </svg> */}
            </div>
          </span>
        </button>
  );
}

