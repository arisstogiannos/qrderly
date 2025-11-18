import { cacheLife, cacheTag } from 'next/cache';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { CartContextProvider } from '@/context/CartContext';
import { getCategories } from '../../_actions/categories';
import { getActiveMenuNotCached, getActiveMenusNotCached } from '../../_actions/menu';
import { getActiveMenuItems } from '../../_actions/menu-items';
import ExpiredMenu from '../_components/ExpiredMenu';
import ScanTracker from '../_components/ScanTracker';
import ActiveOrder from './_components/ActiveOrder';
import Template1 from './_templates/template1/Template1';
import Template2 from './_templates/template2/Template2';

// export const dynamicParams = true; // Allow dynamic routes for any business name
// export const revalidate =60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ businessName: string }>;
}): Promise<Metadata> {
  const businessName = (await params).businessName.replaceAll('-', ' ');

  return {
    metadataBase: new URL('https://www.scanby.cloud'),
    title: `${businessName} | Online Menu`,
    description: 'Check out our menu',
    openGraph: {
      title: `${businessName} | Online Menu`,
      description: 'Check out our menu',
      url: `https://www.scanby.cloud/en/${businessName}/smart-menu`,
      siteName: 'Scanby',
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

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

async function getCategoriesCached(businessName: string) {
  'use cache';
  cacheTag(`categories${businessName}`);
  cacheLife({ revalidate: 60 * 60 });

  return getCategories(businessName);
}

async function getActiveMenuItemsCached(businessName: string) {
  'use cache';
  cacheTag(`menu-items${businessName}`);
  cacheLife({ revalidate: 60 * 60 });

  return getActiveMenuItems(businessName);
}

export async function generateStaticParams() {
  const menus = await getActiveMenusCached(['SMART_QR_MENU', 'SELF_SERVICE_QR_MENU']);

  const params = menus.flatMap((menu) => [
    {
      locale: 'en',
      businessName: String(menu.business.name).replaceAll(' ', '-'),
    },
    {
      locale: 'el',
      businessName: String(menu.business.name).replaceAll(' ', '-'),
    },
  ]);

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

export default async function page({ params }: { params: Promise<{ businessName: string }> }) {
  'use cache';
  const businessName = (await params).businessName.replaceAll('-', ' ');
  cacheTag(`smart-menu${businessName}`);
  cacheLife({ revalidate: 60 * 60 });

  const menu = await getActiveMenuCached(businessName);

  if (!menu) {
    return <ExpiredMenu />;
  }

  if (menu.type === 'QR_MENU') {
    redirect(`/en/${businessName}/menu`);
  }

  const [categories, products] = await Promise.all([
    getCategoriesCached(businessName),
    getActiveMenuItemsCached(businessName),
  ]);
  const colors = menu.theme.split(',');

  return (
    <main className="bg-background text-foreground">
      {/* <Theme theme={menu.theme}/> */}
      <style>{`
        :root {
          --background: ${colors[0]};
          --foreground: ${colors[3]};
          --primary: ${colors[2]};
          --secondary: ${colors[1]};
          --accent: ${colors[4]};
          }
          `}</style>
      <Suspense>
        <ScanTracker businessName={businessName} menuId={menu.id} businessId={menu.businessId} />
      </Suspense>
      <CartContextProvider>
        {menu.template === 'T1' ? (
          <Template1
            businessName={businessName}
            categories={categories}
            menu={menu}
            menuItems={products}
          />
        ) : (
          <Template2
            businessName={businessName}
            categories={categories}
            menu={menu}
            menuItems={products}
          />
        )}
      </CartContextProvider>
      <ActiveOrder menuType={menu.type} businessName={businessName} />
    </main>
  );
}
