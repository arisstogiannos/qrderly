import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';

export default async function BackButton({
  href,
  businessId,
}: {
  href: string;
  businessId: string | undefined;
}) {
  const t = await getTranslations('menu settings');
  return (
    <Button variant="outline" asChild>
      <Link href={`${href}?b=${businessId}`} className="text-sm text-gray-500">
        <ArrowLeftIcon className="w-4 h-4" /> {t('back')}
      </Link>
    </Button>
  );
}
