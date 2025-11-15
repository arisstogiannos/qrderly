import { useParams } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import Loader from './Loader';
import { Button } from './ui/button';

export default function I18nLanguageSelect({ className }: React.ComponentProps<'button'>) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const [loadingLocale, setLoadingLocale] = useState<'el' | 'en' | null>(null);

  useEffect(() => {
    console.log('loadingLocale', loadingLocale);
    console.log('params.locale', params.locale);
    if (loadingLocale && loadingLocale === params.locale?.toString()) setLoadingLocale(null);
  }, [loadingLocale, params.locale]);

  return (
    <Button
      disabled={!!loadingLocale}
      onClick={() => {
        const targetLocale = params.locale === 'en' ? 'el' : 'en';
        setLoadingLocale(targetLocale);
        router.replace(
          // @ts-expect-error
          { params, pathname },

          { locale: targetLocale, scroll: true },
        );
      }}
      className={cn('uppercase bg-foreground max-sm:h-9 max-sm:px-3', className)}
    >
      {loadingLocale ? <Loader className="text-xs" /> : params.locale === 'en' ? 'ελ' : 'en'}
    </Button>
  );
}
