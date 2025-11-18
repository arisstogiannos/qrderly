import { cacheLife, cacheTag } from 'next/cache';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getCategories } from '../../_actions/categories';
import { getActiveMenuNotCached, getActiveMenusNotCached } from '../../_actions/menu';
import { getActiveMenuItems } from '../../_actions/menu-items';
import ExpiredMenu from '../_components/ExpiredMenu';
import ScanTracker from '../_components/ScanTracker';
import Template1 from './_templates/template1/Template1';
import Template2 from './_templates/template2/Template2';

// export const dynamicParams = true; // or false, to 404 on unknown paths
// export const revalidate =60;

export async function generateStaticParams() {
  const menus = await getActiveMenusNotCached(['QR_MENU']);

  const params = menus.flatMap((menu) =>
    ['en', 'el'].map((locale) => ({
      locale,
      businessName: String(menu.business.name).replaceAll(' ', '-'),
    })),
  );

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ businessName: string }>;
}): Promise<Metadata> {
  const businessName = (await params).businessName.replaceAll('-', ' ');

  return {
    title: `${businessName} | Online Menu`,
    description: `Explore ${businessName}'s full menu online.`,
  };
}

export default async function page({ params }: { params: Promise<{ businessName: string }> }) {
  const businessName = (await params).businessName.replaceAll('-', ' ');
  const menu = await getActiveMenuCached(businessName);

  if (!menu) {
    return <ExpiredMenu />;
  }

  // if (menu.type === "SMART_QR_MENU" || menu.type === "SELF_SERVICE_QR_MENU") {
  //   redirect(
  //     "/" + businessName.replaceAll(" ", "-") + "/smart-menu?table=" +" table"
  //   );
  // }

  const [categories, products] = await Promise.all([
    getCategoriesCached(businessName),
    getActiveMenuItemsCached(businessName),
  ]);

  const colors = menu.theme.split(',');

  return (
    <main className="min-h-screen">
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
        <ScanTracker businessName={businessName} businessId={menu.businessId} menuId={menu.id} />
      </Suspense>

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
    </main>
  );
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
