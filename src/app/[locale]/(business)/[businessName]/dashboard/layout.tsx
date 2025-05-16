import { BusinessProvider } from "@/context/BusinessProvider";
import { checkUserAuthorized } from "../_actions/authorization";
import { AppSidebar } from "./_components/Nav/Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import {
  CategoriesIcon,
  ProductsIcon,
  SalesIcon,
} from "./_components/SharedComponents/Icons";

import SubscriptionExpired from "./_components/SharedComponents/SubscriptionExpired";
import { CloudUpload, LayoutDashboard, QrCode, Settings } from "lucide-react";
import { OrderIcon } from "@/app/[locale]/(website)/products/_components/Icons";
import OnboardingDialog from "./_components/SharedComponents/OnboardingDialog";
import { Suspense } from "react";

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
      title: "Upload Menu",
      url: "upload-menu",
      icon: <CloudUpload />,
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

export default async function AdminLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ businessName: string }>;
}>) {
  const businessName = (await params).businessName.replaceAll("-", " ");
  const { user, business } = await checkUserAuthorized(businessName);

  // const queryClient = getQueryClient();

  // if (businessName) {
  //   // await queryClient.prefetchQuery({
  //   //   queryKey: ["menu-items", businessName ],
  //   //   queryFn: async () => {
  //   //     const menuItems = await getMenuItems(businessName);
  //   //     return menuItems;
  //   //   },
  //   //   staleTime: Infinity,
  //   // });

  //   await queryClient.prefetchQuery({
  //     queryKey: ["categories", { businessName }],
  //     queryFn: async () => {
  //       const categories = await getCategoriesWithItemCount(businessName);
  //       return categories;
  //     },
  //     staleTime: Infinity,
  //   });
  // }

  return (
    <SidebarProvider className="bg-primary">
      <AppSidebar
        links={data.navMain}
        user={user}
        business={business}
        className="bg-primary"
      />
      <SidebarInset className="bg-primary ">
        {/* <div className="flex h-svh overflow-hidden bg-primary text-foreground"> */}

        <section className="my-container h-full  overflow-y-auto overflow-x-hidden rounded-xl bg-background w-full p-2 sm:p-10 sm:pb-0 ">
          <SubscriptionExpired business={business} />
          {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
          <BusinessProvider businessName={businessName} business={business}>
            {children}
          </BusinessProvider>
          {/* </HydrationBoundary> */}
          <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
          <Suspense>
            <OnboardingDialog />
          </Suspense>
        </section>
        {/* </div> */}
      </SidebarInset>
    </SidebarProvider>
  );
}
