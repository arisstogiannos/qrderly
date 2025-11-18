import { getTranslations } from 'next-intl/server';
import QrCreator from '@/app/[locale]/(website)/get-started/_components/qr/QrCreator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { checkUserAuthorized } from '../../_actions/authorization';
import TablesForm from '../_components/SharedComponents/TablesForm';

export default async function page({ params }: { params: Promise<{ businessName: string }> }) {
  const businessName = (await params).businessName.replaceAll('-', ' ');
  const { business } = await checkUserAuthorized(businessName);
  const t = await getTranslations('qr settings');
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-2xl">{t('title')}</h1>
        <SidebarTrigger className="lg:absolute top-3 left-2" />
      </div>
      <div className="grid gap-y-8 lg:grid-cols-2">
        <div className="max-w-xl ">
          <QrCreator business={business} url={business.qr?.link ?? ''} />
        </div>
        {business.product === 'SMART_QR_MENU' && <TablesForm business={business} />}{' '}
      </div>
    </div>
  );
}
