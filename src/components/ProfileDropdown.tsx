import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  LayoutDashboard,
  LogOut,
  SquareMenu,
  Stars,
  User2,
} from "lucide-react";

import { Session } from "next-auth";
import { Button } from "./ui/button";
import { signOut } from "@/app/[locale]/(auth)/_actions/login";
import Link from "next/link";
import {Link as IntlLink} from "@/i18n/navigation";

export function ProfileDropdown({ session }: { session: Session | null }) {
  const businesses = session?.user.business.filter(
    (b) => b.menu && b.menu.published
  );
  async function handle(){
    await signOut()
    location.reload()
    
  }

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
                  "https://billing.stripe.com/p/login/14kbLiaQugGt4bm4gg?prefilled_email=" +
                  session.user.email
                }
              >
                <Stars />
                Subscriptions
              </Link>
            </DropdownMenuItem>

            {businesses &&
              businesses.map((b) => (
                <DropdownMenuGroup key={b.name} className="mx-2">
                  <DropdownMenuLabel className="flex items-center gap-2 text-nowrap ml-0 pl-0">
                    {b.name} <hr className="w-full" />
                  </DropdownMenuLabel>

                  <div key={b.name} className=" flex gap-2">
                    <DropdownMenuItem
                      className=" text-sm bg-foreground text-background transition-colors lg:hover:bg-primary"
                      asChild
                    >
                      <IntlLink
                        href={{pathname:"/[businessName]/dashboard",params:{businessName:b.name.replaceAll(" ", "-")}}}
                      >
                        <LayoutDashboard /> Dashboard
                      </IntlLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className=" text-sm bg-foreground text-background transition-colors lg:hover:bg-primary"
                      asChild
                    >
                      <Link
                        target="_blank"
                        href={
                          "/en/" +
                          b.name.replaceAll(" ", "-") +
                          (b.menu?.type === "QR_MENU"
                            ? "/menu"
                            : "/smart-menu?table=admin")
                        }
                      >
                        <SquareMenu /> Menu
                      </Link>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuGroup>
              ))}
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild className="">
              <form  action={handle}>
                <Button className=" w-full" type="submit">
                  <LogOut className="rotate-180 text-background" />
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
