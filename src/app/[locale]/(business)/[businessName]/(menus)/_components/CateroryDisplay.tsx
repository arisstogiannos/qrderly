'use client';
import type { Category } from '@prisma/client';
import { useSearchParams } from 'next/navigation';
import type { Translation } from '@/types';

export default function CategoryDisplay({ category }: { category: Category | undefined }) {
  const lang = useSearchParams().get('l');

  if (!category) return null;

  const { name, translations } = category;
  const translationsAsJson: Translation | null = translations ? JSON.parse(translations) : null;

  const existingTranslation = lang && translationsAsJson && translationsAsJson[lang];
  const categoryName =
    existingTranslation && translationsAsJson[lang].name && translationsAsJson[lang].name !== 'null'
      ? translationsAsJson[lang].name
      : name;
  return <p className="text-2xl font-medium capitalize text-primary">{categoryName}</p>;
}
