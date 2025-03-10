"use client";
import Link from "next/link";
import React, { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { MenuIcon, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/(auth)/_actions/login";
import { Session } from "next-auth";

export function NavLinks({session}:{session:Session | null}) {
   
    return (
      <nav className=" flex gap-6 items-center lg:text-xl flex-col lg:flex-row  max-lg:justify-center h-full text-2xl ">
        <NavLink href={"/"}>Home</NavLink>
        <NavLink href={"/products"}>Products</NavLink>
        <NavLink href={"/pricing"}>Pricing</NavLink>
        <NavLink href={"/FAQ-contact"}>FAQ/Contact</NavLink>
        <Button asChild className="lg:bg-foreground ml-2 p-4  text-lg">
          {!session ? (
            <Link href={"/sign-up"} className="">
              Sign Up
            </Link>
          ) : (
            <Button onClick={() => signOut()} className="">
              Sign Out
            </Button>
          )}
        </Button>
      </nav>
    );
  }
  function NavLink({ children, href }: { children: ReactNode; href: string }) {
    const pathname = usePathname();
    return (
      <Link
        href={href}
        className={`${pathname === href ? "text-primary font-medium" : "text-foreground"} lg:hover:-translate-y-1 transition-transform duration-300`}
      >
        {children}
      </Link>
    );
  }
  
  export function Menu({session}:{session:Session | null}) {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <>
        <MenuButton setIsOpen={setIsOpen} />
        {isOpen ? (
          <div className=" z-10 fixed top-0 left-0 w-full h-screen bg-foreground text-background animate-in fade-in-0 duration-300">
            <NavLinks session={session} />
          </div>
        ) : null}
      </>
    );
  }
  function MenuButton({
    setIsOpen,
  }: {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) {
    function handleClick() {
      setIsOpen((prev) => {
        if (prev) {
          document.body.classList.remove("overflow-hidden");
          return false;
        } else {
          document.body.classList.add("overflow-hidden");
          return true;
        }
      });
    }
    return (
      <Button className="lg:hidden z-20" onClick={handleClick}>
        <MenuIcon />
      </Button>
    );
  }