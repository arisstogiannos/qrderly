'use client';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useOptimistic } from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { CategoryWithItemCount } from '@/types';
import Filters from '../SharedComponents/Filters';
import { Modal } from '../SharedComponents/Modal';
import CategoriesForm from './CategoriesForm';
import CategoriesTable from './CategoriesTale';

export default function CategoriesPage({
  categories,
  businessName,
}: {
  categories: CategoryWithItemCount[];
  businessName: string;
}) {
  const [optimisticCategories, setOptimisticCategory] = useOptimistic(
    categories ?? [],
    (
      state,
      action: {
        newItem: CategoryWithItemCount;
        type: 'delete' | 'add' | 'update';
      },
    ) => {
      if (action.type === 'add') {
        return [...state, action.newItem];
      } else if (action.type === 'delete') {
        return state.filter((item) => item.id !== action.newItem.id);
      } else if (action.type === 'update') {
        const itemToUpdate = state.find((item) => item.id === action.newItem.id);
        if (itemToUpdate) {
          return state.map((item) => (item.id === action.newItem.id ? action.newItem : item));
        }
      }
      return state;
    },
  );

  const t = useTranslations('categoriesPage');
  return (
    <section className="space-y-20">
      <div className="flex justify-between lg:flex-row flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-medium text-2xl">{t('title')}</h1>
          <SidebarTrigger className="lg:absolute top-3 left-2" />
        </div>
        <div className="md:flex lg:gap-10 gap-4 contents">
          <Filters showCategories={false} />
          <Modal
            trigger={
              <Button>
                {t('add')} <Plus />
              </Button>
            }
            title="Add New Category"
            subtitle=""
            classNames="pt-6"
          >
            <CategoriesForm setOptimisticCategory={setOptimisticCategory} />
          </Modal>
        </div>
      </div>
      <CategoriesTable
        categories={optimisticCategories}
        setOptimisticCategory={setOptimisticCategory}
        businessName={businessName}
      />
    </section>
  );
}
