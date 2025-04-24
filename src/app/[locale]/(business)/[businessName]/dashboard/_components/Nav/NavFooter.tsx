"use client";

import {
  BadgeCheck,
  ChevronsUpDown,
  CreditCard,
  Eye,
  LogOut,
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
import {
  signOut,
  signOutDashboard,
} from "@/app/[locale]/(auth)/_actions/login";
import { BusinessExtended, ExtendedUser } from "@/types";

import Image from "next/image";
import { useTranslations } from "next-intl";
import Link from "next/link";
import I18nLanguageSelect from "@/components/I18nLanguageSelect";
import UpgradeSubModal from "../SharedComponents/UpgradeSubModal";
import { useEffect, useState } from "react";
import { encryptTable } from "@/lib/table-crypt";

export function NavFooter({
  user,
  activeBusiness,
}: {
  user: ExtendedUser;
  activeBusiness: BusinessExtended;
}) {
  const { isMobile } = useSidebar();
  const [adminEncryptedTableId, setAdminEncryptedTableId] = useState("");
  const t = useTranslations("admin.navbar");

  useEffect(() => {
    async function encryptAdmin() {
      const decryptedTable = await encryptTable("admin|"+activeBusiness.name);
      if (decryptedTable) {
        setAdminEncryptedTableId(decryptedTable);
      }
    }
    encryptAdmin();
  }, [activeBusiness]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          asChild
        >
          <I18nLanguageSelect className=" bg-transparent border-background border-2" />
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          asChild
        >
          <Link
            href={
              "/en/" +
              activeBusiness.name.replaceAll(" ", "-") +
              (activeBusiness.menu?.type === "QR_MENU"
                ? "/menu"
                : "/smart-menu?table="+adminEncryptedTableId)
            }
            target="_blank"
          >
            <span className="size-8 rounded-lg bg-foreground text-background flex-center">
              <Eye className="size-6" />
            </span>
            <span className="truncate">{t("Visit Live Menu")}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {user.image ? (
                <div className="size-8">
                  <Image
                    src={user.image}
                    alt="profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>
              ) : (
                <div className="size-8 rounded-lg bg-foreground text-background flex-center">
                  <User2 className="size-6" />
                </div>
              )}
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
            {activeBusiness.subscription?.billing === "FREETRIAL" ? (
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <UpgradeSubModal business={activeBusiness} />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuGroup>
            ) : null}

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  target="_blank"
                  href={
                    "https://billing.stripe.com/p/login/14kbLiaQugGt4bm4gg?prefilled_email=" +
                    user.email
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
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOutDashboard}>
              <LogOut />
              {t("Logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
