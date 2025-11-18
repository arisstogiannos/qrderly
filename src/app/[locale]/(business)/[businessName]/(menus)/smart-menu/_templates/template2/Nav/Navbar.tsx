'use client';

import type { Menu } from '@prisma/client';
import { Suspense } from 'react';
import LanguageSelect from '@/app/[locale]/(business)/[businessName]/(menus)/_components/LanguageSelect';
import Cart from '../../../_components/Cart/Cart';
import { SearchBar } from './Search';

export function Navbar({ menu, businessName }: { menu: Menu; businessName: string }) {
  if (!menu.languages) return null;
  return (
    <nav className="my-container z-50 sticky  space-y-10 bg-background/70 py-5 text-foreground backdrop-blur-xl ">
      <div className="flex items-center justify-between">
        <h1 className=" w-fit max-w-60 text-wrap truncate  text-2xl font-semibold uppercase text-primary">
          {businessName}
        </h1>
        <div className="flex items-center gap-4">
          <Suspense>
            <LanguageSelect
              languages={menu.languages}
              Trigger={(children) => (
                <div className="bg-secondary size-11 min-w-11 flex-center text-foreground  rounded-full p-2 cursor-pointer uppercase">
                  {children}
                </div>
              )}
            />
          </Suspense>
          <Suspense>
            <Cart menuTemplate={menu.template} businessName={businessName} />
          </Suspense>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Suspense>
          <SearchBar businessName={businessName} />
        </Suspense>
      </div>
    </nav>
  );
}
