import { cacheLife, cacheTag } from 'next/cache';
import { getTranslations } from 'next-intl/server';
import UploadingForm from '@/app/[locale]/(website)/get-started/_components/generateItems/UploadingForm';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { checkUserAuthorized } from '../../_actions/authorization';
import { getCategories } from '../../_actions/categories';
import { getMenuItems } from '../../_actions/menu-items';

async function getMenuItemsCached(businessName: string) {
  'use cache';
  cacheTag(`menu-items${businessName}`);
  cacheLife({ revalidate: 60 * 60 });

  return getMenuItems(businessName);
}

async function getCategoriesCached(businessName: string) {
  'use cache';
  cacheTag(`categories${businessName}`);
  cacheLife({ revalidate: 60 * 60 });

  return getCategories(businessName);
}

export default async function page({ params }: { params: Promise<{ businessName: string }> }) {
  const businessName = (await params).businessName?.replaceAll('-', ' ');
  await checkUserAuthorized(businessName);

  const t = await getTranslations('uploadMenuPage');
  const menuItems = await getMenuItemsCached(businessName);

  const existingItemsNames = menuItems.map((it) => it.name);
  const existingCategories = await getCategoriesCached(businessName);
  return (
    <div className="space-y-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium">{t('title')}</h1>
          {existingItemsNames.length > 0 && <p className="mt-2">{t('description')}</p>}
        </div>
        <SidebarTrigger className="lg:absolute top-3 left-2" />
      </div>
      <div className="max-w-fit">
        <UploadingForm
          businessName={businessName}
          existingItems={existingItemsNames}
          existingCategories={existingCategories}
        />
      </div>
    </div>
  );
}
