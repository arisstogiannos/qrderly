"use client";
import Link from "next/link";
import React, { ComponentRef, forwardRef, ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { MenuIcon, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { Session } from "next-auth";
import { signOut } from "@/app/[locale]/(website)/(auth)/_actions/login";
import { ProfileDropdown } from "./ProfileDropdown";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { cn } from "@/lib/utils";
import Menu from "./Menu";
import { useRouter } from "@/i18n/navigation";
import I18nLanguageSelect from "./I18nLanguageSelect";
import { useTranslations } from "next-intl";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "QR Menu",
    href: "/products/qr-menu",
    description:
      "Let your customers scan a QR code and instantly access your digital menu",
  },
  {
    title: "Smart QR Menu",
    href: "/products/smart-ordering-qr-menu",
    description:
      "Allow your customers to browse and order directly from their phones",
  },
  {
    title: "Self Service QR Menu",
    href: "/products/self-service-smart-menu",
    description:
      "Your customers order through the menu and will be notified when its ready",
  },
];

export function NavigationDesktop({ session }: { session: Session | null }) {
  const t = useTranslations("navbar")
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {t("Home")}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="">
          <NavigationMenuTrigger>{t("Products")}</NavigationMenuTrigger>
          <NavigationMenuContent className="bg-foreground rounded-2xl">
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[300px] bg-foreground text-background  rounded-xl">
              {/* <li className="row-span-3">
                <NavigationMenuLink asChild className="bg-foreground pointer-events-none">
                  <div
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-black p-6 no-underline outline-none focus:shadow-md"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      shadcn/ui
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Beautifully designed components built with Radix UI and
                      Tailwind CSS.
                    </p>
                  </div>
                </NavigationMenuLink>
              </li> */}
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={t(component.title+".title")}
                  href={component.href}
                >
                  {t(component.title+".description")}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/pricing" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            {  t("Pricing")}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="mr-2">
          <Link href="/FAQ-contact" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {t('FAQ/Contact')}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <I18nLanguageSelect />

        <Button asChild className="lg:bg-foreground ml-2 p-4 mr-2  text-lg">
          {!session ? (
            <Link href={"/sign-up"} className="">
             {t("signBtn")}
            </Link>
          ) : (
            <Link href={"/get-started"} className="">
              {t("createBtn")}
            </Link>
          )}
        </Button>

        {session ? <ProfileDropdown session={session} /> : null}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li className="hover:bg-background/10 rounded-xl transition-all duration-300">
      <Link ref={ref} {...props}>
        <NavigationMenuLink asChild className="hover:text-primary">
          <div
            className={cn(
              "block select-none space-y-1 rounded-md p-3 ",
              className
            )}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </div>
        </NavigationMenuLink>
      </Link>
    </li>
  );
});
ListItem.displayName = "ListItem";

// export function NavLinks({ session }: { session: Session | null }) {
//   return (
//     <nav className=" flex gap-6 items-center lg:text-xl flex-col lg:flex-row  max-lg:justify-center h-full text-2xl ">
//       <NavLink href={"/"}>Home</NavLink>
//       <NavLink href={"/products"}>Products</NavLink>
//       <NavLink href={"/pricing"}>Pricing</NavLink>
//       <NavLink href={"/FAQ-contact"}>FAQ/Contact</NavLink>
//       <Button asChild className="lg:bg-foreground ml-2 p-4  text-lg">
//         {!session ? (
//           <Link href={"/sign-up"} className="">
//             Sign Up
//           </Link>
//         ) : (
//           <Link href={"/get-started"} className="">
//             Create Menu
//           </Link>
//         )}
//       </Button>
//       {session ? <ProfileDropdown session={session} /> : null}
//     </nav>
//   );
// }
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

export function NavigationMobile({ session }: { session: Session | null }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex-center gap-2">

      <ProfileDropdown session={session} />
      <I18nLanguageSelect />
      <MenuButton setIsOpen={setIsOpen} />

      <Menu isOpen={isOpen} setIsOpen={setIsOpen} session={session} />
    </nav>
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
    <Button
      className="lg:hidden z-50 bg-foreground  has-[>svg]:px-1.5 has-[>svg]:py-1.5 h-auto  "
      onClick={handleClick}
    >
      <MenuIcon className="size-6" />
    </Button>
  );
}
