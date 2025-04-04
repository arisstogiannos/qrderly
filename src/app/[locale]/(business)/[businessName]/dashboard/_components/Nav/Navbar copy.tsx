"use client";

import {
  CategoriesIcon,
  CustomersIcon,
  DashboardIcon,
  ProductsIcon,
  SalesIcon,
} from "@/app/[locale]/(business)/[businessName]/dashboard/_components/Icons";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { LogOut, Sidebar } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ComponentProps, useEffect, useState } from "react";
import { signOut } from "@/app/[locale]/(website)/(auth)/_actions/login";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    setIsDesktop(window.innerWidth > 1024);
    function handleResize(e: Event) {
      setIsDesktop(window.innerWidth > 1024);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <nav className="flex flex-col justify-between bg-primary py-20 text-primary-foreground lg:py-40 xl:pl-2">
      <div className="pb-20">
        <Sidebar
          className="mx-auto lg:hidden"
          onClick={() => setOpen((prev) => !prev)}
        />
      </div>
      <div className="flex flex-shrink-0 flex-col gap-3">
        <NavLink href="dashboard">
          <DashboardIcon href="/dashboard" />
          <AnimatePresence mode="wait">
            {(open || isDesktop) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden text-nowrap lg:block"
              >
                Dashboard
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>
        <NavLink href="menu-items">
          <ProductsIcon href="menu-items" />
          <AnimatePresence mode="wait">
            {(open || isDesktop) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden text-nowrap lg:block"
              >
                Menu Items
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>
        <NavLink href="categories">
          <CategoriesIcon href="/categories" />
          <AnimatePresence mode="wait">
            {(open || isDesktop) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden text-nowrap lg:block"
              >
                Categories
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>
        <NavLink href="live-orders">
          <SalesIcon href="dashboard/live-orders" />
          <AnimatePresence mode="wait">
            {(open || isDesktop) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden text-nowrap lg:block "
              >
                Live Orders
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>
        <NavLink href="all-orders">
          <SalesIcon href="dashboard/all-orders" />
          <AnimatePresence mode="wait">
            {(open || isDesktop) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden text-nowrap lg:block"
              >
               All Orders
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>
  
      </div>
      <form action={signOut} className="ml-3 mt-auto xl:ml-10">
        {""}
        <button type="submit" className="flex gap-2 cursor-pointer">
          <LogOut className="rotate-180" />{" "}
          <AnimatePresence mode="wait">
            {(open || isDesktop) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden text-nowrap  lg:block"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </form>
    </nav>
  );
}
export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();
  const { businessName } = useParams();

    const baseUrl = `/${businessName}/dashboard/`;
  
    const href = props.href==="dashboard"?baseUrl:baseUrl + props.href;

  return (
    <Link
      {...props}
      href={href}
      className={cn(
        "group flex h-12 items-center gap-x-4 rounded-l-xl px-3 text-lg font-medium transition-colors duration-200 focus-visible:bg-secondary focus-visible:text-secondary-foreground lg:hover:bg-backgroundAdmin lg:hover:text-secondary-foreground xl:h-14 xl:pl-5 xl:pr-8",
        pathname.endsWith(props.href.toString()) &&
          "bg-background text-foreground"
      )}
    />
  );
}
