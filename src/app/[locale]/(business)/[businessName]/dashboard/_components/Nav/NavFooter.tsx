"use client";

import {
  BadgeCheck,
  Bell,
  BriefcaseBusiness,
  ChevronsUpDown,
  CreditCard,
  Eye,
  LogOut,
  Sparkles,
  User2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "@/app/[locale]/(website)/(auth)/_actions/login";
import { User } from "next-auth";
import { BusinessExtended, ExtendedUser } from "@/types";
import { Business } from "@prisma/client";
import Link from "next/link";

export function NavFooter({
  user,
  activeBusiness,
}: {
  user: ExtendedUser;
  activeBusiness: BusinessExtended;
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          asChild
        >
          <a
            href={
              "/" +
              activeBusiness.name.replaceAll(" ", "-") +
              (activeBusiness.menu.type === "QR_MENU" ? "/menu" : "/smart-menu") +"?table=admin"
            }
            target="_blank"
            rel="noreferrer"
          >
            <span className="size-8 rounded-lg bg-foreground text-background flex-center">
              <Eye className="size-6" />
            </span>
            <span className="truncate">Visit Live Menu</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="size-8 rounded-lg bg-foreground text-background flex-center">
                <User2 className="size-6" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-sm">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {activeBusiness.subscription.billing === "FREETRIAL" ? (
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Sparkles />
                  Upgrade to Pro
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuGroup>
            ) : null}

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  target="_blank"
                  href={
                    "https://billing.stripe.com/p/login/test_14kcOi9HdbsYdSU6oo"
                  }
                >
                  <CreditCard />
                  Subscriptions
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={"businesses"}>
                  <BriefcaseBusiness />
                  Businesses
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
