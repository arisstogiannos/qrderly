import { type ReactNode } from 'react';
import MenuFooter from '@/components/MenuFooter';
import ScrollToTop from '@/components/ScrollToTop';
import { Toaster } from '@/components/ui/sonner';
import { cache } from '@/lib/cache';
import { getActiveMenuNotCached, getActiveMenusNotCached } from '../_actions/menu';
import ExpiredMenu from './_components/ExpiredMenu';

export const dynamicParams = true; // or false, to 404 on unknown paths
// export const revalidate =60;

export async function generateStaticParams() {
  const getActiveMenusCache = cache(getActiveMenusNotCached, ['active-menus'], {
    tags: ['active-menus'],
  });
  const menus = await getActiveMenusCache(['QR_MENU', 'SMART_QR_MENU', 'SELF_SERVICE_QR_MENU']);

  return menus.map((menu) => ({
    locale: 'en',
    businessName: String(menu.business.name).replaceAll(' ', '-'),
  }));
}

export default async function layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ businessName: string }>;
}) {
  const businessName = (await params).businessName.replaceAll('-', ' ');

  const getActiveMenu = cache(getActiveMenuNotCached, [`active-menu${businessName}`], {
    tags: [`active-menu${businessName}`],
  });

  const menu = await getActiveMenu(businessName);

  if (!menu) {
    return <ExpiredMenu />;
  }

  const colors = menu.theme.split(',');

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
      {children}
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <ScrollToTop />
      <MenuFooter />
    </div>
  );
}
