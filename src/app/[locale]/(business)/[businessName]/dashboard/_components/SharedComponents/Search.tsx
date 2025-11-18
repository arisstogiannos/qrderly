'use client';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { useFiltersContext } from '@/context/FiltersProvider';

export default function Search() {
  const { searchQuery, setSearchQuery } = useFiltersContext();
  const t = useTranslations('filters');
  return (
    <Input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder={t('search')}
    />
  );
}
