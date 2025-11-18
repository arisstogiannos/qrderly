import { cacheLife, cacheTag } from 'next/cache';
import { FiltersProvider } from '@/context/FiltersProvider';
import { checkUserAuthorized } from '../../_actions/authorization';
import { getCategoriesWithItemCount } from '../../_actions/categories';
import CategoriesPage from '../_components/Categories/CategoriesPage';

async function getCategoriesWithItemCountCached(businessName: string) {
  'use cache';
  cacheTag(`categories${businessName}`);
  cacheLife({ revalidate: 60 * 60 });

  return getCategoriesWithItemCount(businessName);
}

export default async function page({ params }: { params: Promise<{ businessName: string }> }) {
  const businessName = (await params).businessName.replaceAll('-', ' ');
  const categories = await getCategoriesWithItemCountCached(businessName);

  const { business } = await checkUserAuthorized(businessName);

  return (
    <FiltersProvider languages={business.menu?.languages ?? ''}>
      <CategoriesPage categories={categories} businessName={businessName} />
    </FiltersProvider>
  );
}
