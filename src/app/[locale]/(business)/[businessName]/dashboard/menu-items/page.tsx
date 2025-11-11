import { FiltersProvider } from '@/context/FiltersProvider';
import { cache } from '@/lib/cache';
import { checkUserAuthorized } from '../../_actions/authorization';
import { getCategoriesWithItemCount } from '../../_actions/categories';
import { getMenuItems } from '../../_actions/menu-items';
import MenuItemsPage from '../_components/MenuItems/MenuItemsPage';

export default async function page({ params }: { params: Promise<{ businessName: string }> }) {
  const businessName = (await params).businessName.replaceAll('-', ' ');
  const { business } = await checkUserAuthorized(businessName);

  const getMenuItmesCached = cache(getMenuItems, [`menu-items${businessName}`], {
    tags: [`menu-items${businessName}`],
  });

  const menuitems = await getMenuItmesCached(businessName);
  const getCategoriesCached = cache(getCategoriesWithItemCount, [`categories${businessName}`], {
    tags: [`categories${businessName}`],
  });

  const categories = await getCategoriesCached(businessName);
  // const geMenuItmesCached = cache(getMenuItems,["menu-items",  businessName ],{tags:["menu-items", businessName]});
  const languages = business.menu?.languages ?? '';

  return (
    <FiltersProvider languages={languages}>
      <MenuItemsPage businessName={businessName} menuItems={menuitems} categories={categories} />
    </FiltersProvider>
  );
}
