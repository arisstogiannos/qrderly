'use client';

import { useParams } from 'next/navigation';
import type React from 'react';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import Loader from './Loader';
import { Button } from './ui/button';

export default function I18nLanguageSelect({ className }: React.ComponentProps<'button'>) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = () => {
    const targetLocale = params.locale === 'en' ? 'el' : 'en';

    startTransition(() => {
      router.replace(
        // @ts-expect-error
        {
          pathname,
          params: params as Record<string, string>,
        },
        { locale: targetLocale, scroll: true },
      );
    });
  };

  return (
    <Button
      disabled={isPending}
      onClick={handleLocaleChange}
      className={cn('uppercase bg-foreground max-sm:h-9 max-sm:px-3', className)}
    >
      {isPending ? <Loader className="text-xs" /> : params.locale === 'en' ? 'ελ' : 'en'}
    </Button>
  );
}
