"use client"

import * as React from "react"
import { ChevronsUpDown, Command, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Business } from "@prisma/client"
import Link from "next/link"

export function TeamSwitcher({
  businesses,
  business,
}: {
  businesses: Business[]
  business: Business
}) {
  const { isMobile } = useSidebar()
  const [activeBusiness, setActiveBusiness] = React.useState(business)

  if (!activeBusiness) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Command/>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeBusiness.name}
                </span>
                <span className="truncate text-xs">{activeBusiness.product.replaceAll("_"," ")}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Menus
            </DropdownMenuLabel>
            {businesses.map((business, index) => (
              <DropdownMenuItem
                key={business.name}
                onClick={() => setActiveBusiness(business)}
                className="gap-2 p-2"
                asChild
              >
                <Link href={`/${business.name.replaceAll(" ","-")}/dashboard`}>
                {/* <div className="flex size-6 items-center justify-center rounded-sm border">
                  <business.logo className="size-4 shrink-0" />
                  </div> */}
                {business.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" asChild>
              <Link href={'/get-started'}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Create New Menu</div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
