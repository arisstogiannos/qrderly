
import * as React from "react";
import {
  
  LayoutDashboard,
  QrCode,
  Settings,

} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,

} from "@/components/ui/sidebar";
import { NavLinks } from "./NavLinks";
import { NavFooter } from "./NavFooter";
import { OrderIcon } from "@/app/(website)/products/_components/Icons";
import { TeamSwitcher } from "./BusinessSwitcher";
import { BusinessExtended, ExtendedUser } from "@/types";
import { CategoriesIcon, ProductsIcon, SalesIcon } from "../Icons";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "",
      icon: <LayoutDashboard />,
      isActive: false,
      
    },
    {
      title: "Qr Settings",
      url: "qr",
      icon: <QrCode />,
      isActive: false,
      
    },
    {
      title: "Menu",
      url: "",
      icon: <OrderIcon />,
      isActive: false,
      items: [
        {
          title: "Items",
          url: "menu-items",
          icon: <ProductsIcon href={"menu-items"} />,
        },
        {
          title: "Categories",
          url: "categories",
          icon: <CategoriesIcon href="categories" />,
        },
        {
          title: "Settings",
          url: "settings",
          icon: <Settings color="white" />,
        },
      ],
    },
    {
      title: "Orders",
      url: "",
      icon: <OrderIcon />,
      items: [
        {
          title: "All Orders",
          url: "all-orders",
          icon: <SalesIcon href="all-orders" />,
        },
        {
          title: "Live Orders",
          url: "live-orders",
          icon: <OrderIcon />,
        },
      ],
    },
  ],
};

export function AppSidebar({
  user,
  business,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: ExtendedUser;
  business: BusinessExtended;
}) {
  const navLinks =
    business.product === "QR_MENU"
      ? data.navMain.filter((item) => item.title !== "Orders")
      : data.navMain;

  return (
    <Sidebar variant="inset" {...props} className="bg-primary rounded-3xl">
      <SidebarHeader>
        <TeamSwitcher businesses={user.business.filter((b)=>b?.menu?.published)} business={business} />
      </SidebarHeader>
      <SidebarContent>
        <NavLinks items={navLinks} activeBusinessName={business.name} />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter activeBusiness={business} user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
