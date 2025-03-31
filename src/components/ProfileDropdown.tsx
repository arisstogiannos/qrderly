import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LayoutDashboard, SquareMenu, Stars, User2 } from "lucide-react";
import Link from "next/link";
import { Session } from "next-auth";
import { UserRole } from "@prisma/client";
import { signOut } from "@/app/(website)/(auth)/_actions/login";
import { Button } from "./ui/button";
import { DashboardIcon } from "@/app/(business)/[businessName]/dashboard/_components/Icons";

export function ProfileDropdown({ session }: { session: Session | null }) {
  const businesses = session?.user.business.filter(
    (b) => b.menu && b.menu.published
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="lg:bg-foreground lg:text-background text-foreground rounded-full p-2 cursor-pointer">
          <User2 size={"1.5rem"} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="pb-0">Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {session ? (
          <>
            <DropdownMenuItem asChild>
              <Link
                target="_blank"
                href={
                  "https://billing.stripe.com/p/login/test_14kcOi9HdbsYdSU6oo"
                }
              >
                <Stars />
                Subscriptions
              </Link>
            </DropdownMenuItem>

              {businesses &&
                businesses.map((b) => (
            <DropdownMenuGroup key={b.name} className="mx-2">

              <DropdownMenuLabel className="flex items-center gap-2 text-nowrap ml-0 pl-0">{b.name} <hr className="w-full" /></DropdownMenuLabel>

                  <div key={b.name} className=" flex gap-2">
                    <DropdownMenuItem className=" text-sm bg-foreground text-background transition-colors lg:hover:bg-primary" asChild>
                      <Link href={"/" + b.name.replaceAll(" ","-") + "/dashboard"}>
                      <LayoutDashboard/> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className=" text-sm bg-foreground text-background transition-colors lg:hover:bg-primary" asChild>
                      <Link target="_blank" href={"/" + b.name.replaceAll(" ","-") + "/menu"}>
                       <SquareMenu/> Menu
                      </Link>
                    </DropdownMenuItem>
                  </div>
            </DropdownMenuGroup>
                ))}

            <DropdownMenuItem asChild>
              <form action={signOut}>
                <Button variant={"destructive"} type="submit">
                  Sign Out
                </Button>
              </form>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem>
            <Link href="/sign-up">Sign In</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
