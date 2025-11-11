'use client';
import { PlusSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CategoryWithItemCount } from '@/types';
import CategoriesForm from '../Categories/CategoriesForm';

export default function Categories({
  currCategory,
  categories,
}: {
  currCategory?: string;
  categories: CategoryWithItemCount[];
}) {
  const [addNewCategory, setAddNewCategory] = useState(false);
  const t = useTranslations('categoriesPage');

  return (
    <Select
      required
      defaultValue={currCategory}
      name="categoryId"
      onOpenChange={() => setAddNewCategory(false)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent>
        {!categories || categories.length === 0 ? (
          <SelectItem value={'all'} className="pointer-events-none">
            {t('noCategories')}
          </SelectItem>
        ) : (
          !addNewCategory &&
          categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))
        )}
        {!addNewCategory ? (
          <Button onClick={() => setAddNewCategory(true)} className="w-full" variant={'outline'}>
            <PlusSquare /> {t('add')}
          </Button>
        ) : (
          <div className="p-2 space-y-2 max-w-[350px] mx-auto">
            <CategoriesForm onSuccess={() => setAddNewCategory(false)} />
            <Button className="w-full" onClick={() => setAddNewCategory(false)} variant={'outline'}>
              {t('cancel')}
            </Button>
          </div>
        )}
      </SelectContent>
    </Select>
  );
}
