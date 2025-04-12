import React, { ReactNode } from "react";
import MenuFooter from "@/components/MenuFooter";
import { Toaster } from "@/components/ui/sonner";
import { cache } from "@/lib/cache";
import {
  getActiveMenuNotCached,
  getActiveMenusNotCached,
} from "../_actions/menu";
import { notFound } from "next/navigation";
import ScrollToTop from "@/components/ScrollToTop";

export async function generateStaticParams() {
  const menus = await getActiveMenusNotCached([
    "QR_MENU",
    "SMART_QR_MENU",
    "SELF_SERVICE_QR_MENU",
  ]);

  return menus.map((menu) => ({
    locale: "en",
    businessName: String(menu.business.name).replaceAll(" ", "-"),
  }));
}

export default async function layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ businessName: string }>;
}) {
  const businessName = (await params).businessName.replaceAll("-", " ");

  const getActiveMenu = cache(
    getActiveMenuNotCached,
    ["active-menu" + businessName],
    {
      tags: ["active-menu" + businessName],
    }
  );

  const menu = await getActiveMenu(businessName);

  if (!menu) {
    notFound();
  }

  const colors = menu.theme.split(",");

  return (
    <div className="">
      <style>{`
        :root {
          --background: ${colors[0]};
          --foreground: ${colors[3]};
          --primary: ${colors[2]};
          --secondary: ${colors[1]};
          --accent: ${colors[4]};
        }
      `}</style>
      <>{children}</>
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <ScrollToTop />
      <MenuFooter />
    </div>
  );
}
