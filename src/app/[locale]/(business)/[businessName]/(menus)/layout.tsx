import { cacheLife, cacheTag } from 'next/cache';
import { type ReactNode } from 'react';
import MenuFooter from '@/components/MenuFooter';
import ScrollToTop from '@/components/ScrollToTop';
import { Toaster } from '@/components/ui/sonner';
import { getActiveMenuNotCached, getActiveMenusNotCached } from '../_actions/menu';
import ExpiredMenu from './_components/ExpiredMenu';

// export const dynamicParams = true; // or false, to 404 on unknown paths
// export const revalidate =60;

async function getActiveMenusCached(types: Parameters<typeof getActiveMenusNotCached>[0]) {
  'use cache';
  cacheTag('active-menus');
  cacheLife({ revalidate: 60 * 60 });

  return getActiveMenusNotCached(types);
}

async function getActiveMenuCached(businessName: string) {
  'use cache';
  cacheTag(`active-menu${businessName}`);
  cacheLife({ revalidate: 60 * 60 });

  return getActiveMenuNotCached(businessName);
}

export async function generateStaticParams() {
  const menus = await getActiveMenusCached(['QR_MENU', 'SMART_QR_MENU', 'SELF_SERVICE_QR_MENU']);

  const params = menus.map((menu) => ({
    locale: 'en',
    businessName: String(menu.business.name).replaceAll(' ', '-'),
  }));

  // Next.js 16 requires at least one result when using Cache Components
  if (params.length === 0) {
    return [
      {
        locale: 'en',
        businessName: 'placeholder',
      },
    ];
  }

  return params;
}

export default async function layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ businessName: string }>;
}) {
  const businessName = (await params).businessName.replaceAll('-', ' ');

  const menu = await getActiveMenuCached(businessName);

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
