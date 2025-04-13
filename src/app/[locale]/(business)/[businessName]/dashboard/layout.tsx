import { BusinessProvider } from "@/context/BusinessProvider";
import { checkUserAuthorized } from "../_actions/authorization";
import { AppSidebar } from "./_components/Nav/Navbar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

import SubscriptionExpired from "./_components/SharedComponents/SubscriptionExpired";

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
      <AppSidebar user={user} business={business} className="bg-primary" />
      <SidebarInset className="bg-primary ">
        {/* <div className="flex h-svh overflow-hidden bg-primary text-foreground"> */}

        <section className="my-container h-full  overflow-y-auto overflow-x-hidden rounded-xl bg-background w-full p-4 sm:p-10 sm:pb-0 ">
          <SubscriptionExpired business={business} />
          {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
            <BusinessProvider businessName={businessName} business={business}>
              {children}
            </BusinessProvider>
          {/* </HydrationBoundary> */}
          <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
        </section>
        {/* </div> */}
      </SidebarInset>
    </SidebarProvider>
  );
}
