'use client';
import type { MenuItem } from '@prisma/client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type React from 'react';
import { type FormEvent, startTransition, useActionState, useState } from 'react';
import CloudImage from '@/components/CloudImage';
import Loader from '@/components/Loader';
import { ErrorMessage } from '@/components/Messages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBusinessContext } from '@/context/BusinessProvider';
import { useModalContext } from '@/context/ModalProvider';
import type { CategoryWithItemCount, MenuItemWithCategory } from '@/types';
import { upsertMenuItem } from '../../../_actions/menu-items';
import TranslateCheckBox from '../SharedComponents/TranslateCheckBox';
import Categories from './CategoriesItemForm';
import Options from './Options';

export default function MenuItemForm({
  item,
  setOptimisticItem,
  categories,
}: {
  item?: MenuItem;
  setOptimisticItem: (action: {
    newItem: MenuItemWithCategory;
    type: 'delete' | 'add' | 'update';
  }) => void;
  categories: CategoryWithItemCount[];
}) {
  const { businessName, business } = useBusinessContext();
  const [state, action, isPending] = useActionState(upsertMenuItem.bind(null, businessName), null);
  const { setOpen } = useModalContext();
  const [preview, setPreview] = useState<string | null>(null);
  const t = useTranslations('menuItemForm');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    const newItem: MenuItemWithCategory = {
      id: item?.id ?? crypto.randomUUID(), // Temporary ID
      name: (data.name as string) ?? '',
      description: (data.description as string) || null, // Ensuring nullable
      priceInCents: Number(data.priceInCents) || 0,
      categoryId: data.categoryId as string,
      menuId: data.menuId as string,
      isAvailable: true, // Default to available
      createdAt: new Date(),
      updatedAt: new Date(),
      category: { name: data.category as string }, // Assuming category name is provided
      preferences: (data.preferences as string) || null, // Ensuring nullable
      translations: (data.translations as string) || null, // Ensuring nullable
      imagePath: 'pending', // Defaulting to null
      stock: null, // Defaulting to null
    };
    startTransition(() => {
      setOptimisticItem({ newItem, type: item ? 'update' : 'add' });
    });
    setOpen(false);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setPreview(null);
      }
    }
  };

  return (
    <form
      action={action}
      className="space-y-5 max-w-xl max-h-[80vh] overflow-y-auto "
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <Label htmlFor="name">{t('name')}</Label>
        <Input
          name="name"
          id="name"
          required
          defaultValue={item?.name || state?.data?.name}
          minLength={1}
          maxLength={100}
          pattern="[^_]*"
          title={t('nameValidation')}
          placeholder={t('namePlaceholder')}
        />
        <TranslateCheckBox name="translateName" />
        {state?.errors?.name?.map((er) => {
          return <ErrorMessage key={er} classNames="text-sm bg-transparent p-0 " msg={er} />;
        })}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">
          {t('description')} <span className="text-muted-foreground">({t('optional')})</span>
        </Label>
        <Input
          name="description"
          id="description"
          defaultValue={(item?.description || state?.data?.description) ?? undefined}
          pattern="[^_]*"
          title={t('descriptionValidation')}
          maxLength={100}
          placeholder={t('descriptionPlaceholder')}
        />
        <TranslateCheckBox name={'translateDescription'} />
        {state?.errors?.description?.map((er) => {
          return <ErrorMessage key={er} classNames="text-sm bg-transparent p-0 " msg={er} />;
        })}
      </div>
      <div className="space-y-2">
        <Label htmlFor="categoryId">{t('category')}</Label>
        <Categories categories={categories} currCategory={item?.categoryId} />
        {state?.errors?.categoryId?.map((er) => {
          return <ErrorMessage key={er} classNames="text-sm bg-transparent p-0 " msg={er} />;
        })}
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInCents">
          {t('price')}
          <span className="text-muted-foreground">{t('priceDesc')}</span>
        </Label>
        <Input
          type="number"
          name="priceInCents"
          id="priceInCents"
          defaultValue={item?.priceInCents || state?.data?.priceInCents}
          required
          min={1}
          placeholder={t('pricePlaceholder')}
        />
        {state?.errors?.priceInCents?.map((er) => {
          return <ErrorMessage key={er} classNames="text-sm bg-transparent p-0 " msg={er} />;
        })}
      </div>
      <div className="space-y-2">
        <Label htmlFor="options">
          {t('options')} <span className="text-muted-foreground">({t('optional')})</span>
        </Label>
        <Options defaultOptions={(item?.preferences || state?.data?.options) ?? undefined} />
        {state?.errors?.options?.map((er) => {
          return <ErrorMessage key={er} classNames="text-sm bg-transparent p-0 " msg={er} />;
        })}
      </div>
      {business.menu?.template === 'T1' && (
        <div className="space-y-2">
          <Label htmlFor="image">{t('image')}</Label>
          <label className="cursor-pointer mx-auto relative flex flex-col items-center justify-center border-dashed border-2 border-primary/50 rounded-lg w-full xl:w-[400] h-[250] bg-accent/50 hover:bg-accent hover:border-primary transition-colors">
            {preview ? (
              <img src={preview} alt="Uploaded" className="w-full h-full object-cover rounded-lg" />
            ) : item?.imagePath ? (
              <CloudImage alt="" src={item.imagePath} fill className="object-cover" />
            ) : (
              <div className=" flex flex-col items-center gap-4">
                <Image
                  src={'/image-placeholder.png'}
                  quality={100}
                  width={150}
                  height={150}
                  alt="placeholder"
                />
                <span className="text-gray-500">{t('imagePlaceholder')}</span>
              </div>
            )}
            <input
              type="file"
              accept={'image/*'}
              name={'image'}
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          {state?.errors?.image?.map((er) => {
            return <ErrorMessage key={er} classNames="text-sm bg-transparent p-0 " msg={er} />;
          })}
        </div>
      )}
      {item && <input type="text" name="id" defaultValue={item.id} hidden />}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader /> : t('save')}
      </Button>
      {state?.error ? <ErrorMessage msg={state.error} /> : null}
    </form>
  );
}
