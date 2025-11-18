'use client';

import type { MenuItem } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { SearchIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getMenuItems } from '@/app/[locale]/(business)/[businessName]/_actions/menu-items';
import type { Translation } from '@/types';
import { SearchModal } from './SearchModal';

export function SearchBar({ businessName }: { businessName: string }) {
  const [query, setQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<MenuItem[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const lang = searchParams.get('l') ?? '';

  const { data: items } = useQuery({
    queryKey: [`menu-items${businessName}`],
    queryFn: async () => {
      const menuItems = await getMenuItems(businessName);
      return menuItems;
    },
    staleTime: Number.POSITIVE_INFINITY,
  });

  useEffect(() => {
    if (items) {
      const newFiltered = filter(items, lang, query);
      setOpen(newFiltered.length > 0);
      setFilteredProducts(newFiltered);
    }
  }, [query]);

  return (
    <div className="bg-transparent outline-primary/50 text-primary/50 relative col-span-full  flex items-center gap-3 rounded-md px-4 py-2 outline-2 focus-within:text-primary focus-within:outline-primary">
      <SearchIcon />
      <input
        type="text"
        placeholder="Search"
        className="bg-transparent placeholder:text-primary/50 w-full focus:outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value.toLowerCase())}
        onClick={() => setOpen(true)}
      />
      {filteredProducts.length > 0 && open && (
        <SearchModal products={filteredProducts} setOpen={setOpen} lang={lang} />
      )}
    </div>
  );
}

function filter(products: MenuItem[], lang: string, query: string) {
  const filteredProducts = products.filter((p) => {
    const translationsAsJson: Translation | null = p.translations
      ? JSON.parse(p.translations)
      : null;
    const existingTranslation = translationsAsJson && translationsAsJson[lang];

    let condition;

    if (existingTranslation) {
      condition =
        (translationsAsJson[lang].name?.toLowerCase().includes(query) ||
          translationsAsJson[lang].description?.toLowerCase().includes(query)) &&
        query !== '';
    } else {
      condition =
        (p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.categoryId.toLowerCase().includes(query)) &&
        query !== '';
    }

    return condition;
  });
  return filteredProducts;
}
