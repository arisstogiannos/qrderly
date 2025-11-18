import { cacheLife, cacheTag } from 'next/cache';
import { FiltersProvider } from '@/context/FiltersProvider';
import { checkUserAuthorized } from '../../_actions/authorization';
import { getCategoriesWithItemCount } from '../../_actions/categories';
import { getMenuItems } from '../../_actions/menu-items';
import MenuItemsPage from '../_components/MenuItems/MenuItemsPage';

async function getMenuItemsCached(businessName: string) {
  'use cache';
  cacheTag(`menu-items${businessName}`);
  cacheLife({ revalidate: 60 * 60 });

  return getMenuItems(businessName);
}

async function getCategoriesWithItemCountCached(businessName: string) {
  'use cache';
  cacheTag(`categories${businessName}`);
  cacheLife({ revalidate: 60 * 60 });

  return getCategoriesWithItemCount(businessName);
}

export default async function page({ params }: { params: Promise<{ businessName: string }> }) {
  const businessName = (await params).businessName.replaceAll('-', ' ');
  const { business } = await checkUserAuthorized(businessName);

  const menuitems = await getMenuItemsCached(businessName);
  const categories = await getCategoriesWithItemCountCached(businessName);
  // const geMenuItmesCached = cache(getMenuItems,["menu-items",  businessName ],{tags:["menu-items", businessName]});
  const languages = business.menu?.languages ?? '';

  return (
    <FiltersProvider languages={languages}>
      <MenuItemsPage businessName={businessName} menuItems={menuitems} categories={categories} />
    </FiltersProvider>
  );
}
