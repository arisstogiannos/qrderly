'use client';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBusinessContext } from '@/context/BusinessProvider';
import { useFiltersContext } from '@/context/FiltersProvider';
import { getCategories } from '../../../_actions/categories';

export default function Categories() {
  const { setCategory } = useFiltersContext();
  const { businessName } = useBusinessContext();
  const t = useTranslations('filters');

  const {
    data: categories,
    error,
    isLoading,
  } = useQuery({
    queryKey: [`categories${businessName}`],
    queryFn: async () => {
      const categories = await getCategories(businessName);
      return categories;
    },
    staleTime: Number.POSITIVE_INFINITY,
  });

  if (isLoading) return <div className="bg-accent rounded-xl animate-pulse w-40 h-10"></div>;

  // if (!categories || categories.length === 0) return null
  return (
    <Select onValueChange={(v) => setCategory(v)} defaultValue="all">
      <SelectTrigger className="min-w-40 max-md:w-full">
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent>
        {!categories || categories.length === 0 ? (
          <SelectItem value={'all'} className="pointer-events-none">
            {t('noCategories')}
          </SelectItem>
        ) : (
          <>
            <SelectItem key={'all'} value={'all'}>
              {t('all categories')}
            </SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </>
        )}
      </SelectContent>
    </Select>
  );
}
