import { getTranslations } from 'next-intl/server';
import UploadingForm from '@/app/[locale]/(website)/get-started/_components/generateItems/UploadingForm';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cache } from '@/lib/cache';
import { checkUserAuthorized } from '../../_actions/authorization';
import { getCategories } from '../../_actions/categories';
import { getMenuItems } from '../../_actions/menu-items';

export default async function page({ params }: { params: Promise<{ businessName: string }> }) {
  const businessName = (await params).businessName?.replaceAll('-', ' ');
  await checkUserAuthorized(businessName);

  const getMenuItmesCached = cache(getMenuItems, [`menu-items${businessName}`], {
    tags: [`menu-items${businessName}`],
  });
  const getCachedCategories = cache(getCategories, [`categories${businessName}`], {
    tags: [`categories${businessName}`],
  });

  const t = await getTranslations('uploadMenuPage');
  const menuItems = await getMenuItmesCached(businessName);

  const existingItemsNames = menuItems.map((it) => it.name);
  const existingCategories = await getCachedCategories(businessName);
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
