import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { ReactNode } from "react";

export async function NavLinks({
  items,
  activeBusinessName,
}: {
  items: {
    title: string;
    url: string;
    icon: ReactNode;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon: ReactNode;
    }[];
  }[];
  activeBusinessName: string;
}) {
  const t = await getTranslations("admin.navbar")
  return (
    <SidebarGroup className="mt-10 ">
      <SidebarMenu>
        {items.length > 1
          ? items.map((item) =>
              item.items ? (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={false}
                    className="pointer-events-none"
                  >
                    <span>{t(item.title)}</span>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub>
                      {item.items.map((item) => (
                        <SidebarMenuSubItem
                          className="bg-transparent "
                          key={item.title}
                        >
                          <SidebarMenuSubButton
                            asChild
                            className="bg-transparent text-base py-4 transition-colors hover:bg-accent/30 hover:text-background text-nowrap w-fit"
                          >
                            <Link
                              href={
                                "/" +
                                activeBusinessName.replaceAll(" ", "-") +
                                "/dashboard/" +
                                item.url
                              }
                            >
                              {item.icon}

                              {t(item.title)}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              ) : (
                <SidebarMenuItem key={item.title} className="mt-1  ">
                  <SidebarMenuButton
                    className=" text-base transition-colors hover:bg-accent/30 hover:text-background py-5"
                    asChild
                    // isActive={true}
                  >
                    <Link
                      href={
                        "/" +
                        activeBusinessName.replaceAll(" ", "-") +
                        "/dashboard/" +
                        item.url
                      }
                    >
                      {item.icon}
                      <span className="text-nowrap">{t(item.title)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            )
          : items[0].items?.map((item) => (
              <SidebarMenuItem key={item.title} className="mt-1  ">
                <SidebarMenuButton
                  className=" text-lg transition-colors hover:bg-accent/30 hover:text-background py-5"
                  asChild
                  // isActive={true}
                >
                  <Link
                    href={
                      "/" +
                      activeBusinessName.replaceAll(" ", "-") +
                      "/dashboard/" +
                      item.url
                    }
                  >
                    {item.icon}
                    <span className="text-nowrap">{t(item.title)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
