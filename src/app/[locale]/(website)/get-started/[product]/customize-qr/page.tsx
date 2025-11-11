import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { productPath } from '@/data';
import type { ProductURL } from '@/types';
import BackButton from '../../_components/BackButton';
import QrCreator from '../../_components/qr/QrCreator';
import { checkUser } from '../../isAllowed';
export default async function page({
  params,
  searchParams,
}: {
  params: Promise<{ product: ProductURL }>;
  searchParams: Promise<{ b: string }>;
}) {
  const product = (await params).product;
  if (!product) notFound();

  const b = (await searchParams).b;

  const t = await getTranslations('qr settings');

  const result = await checkUser(product);

  if (!result) {
    redirect(`/get-started/${product}/business-setup`);
  }

  if (!b) {
    if (result.redirect === 'noUnsetBusiness') {
      redirect(`/get-started/${product}/business-setup`);
    }
    if (result?.redirect === 'businessWithoutMenu') {
      redirect(`/get-started/${product}/menu-settings`);
    }
    // if (result.redirect === "emptyMenu") {
    //   redirect("/get-started/" + product + "/generate-items");
    // }
    if (result.redirect === 'unpublishedMenu') {
      redirect(`/get-started/${product}/publish`);
    }
  } else {
    if (b !== result.business.id) {
      redirect('/unauthorized');
    }
  }

  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/${result.business.name.replaceAll(' ', '-')}/${productPath[product]}`;

  return (
    <section className="flex flex-col lg:min-w-xl max-w-7xl gap-y-6">
      <div className="flex items-center gap-x-5">
        <h1 className="text-2xl font-medium">{t('title')}</h1>
        <BackButton
          href={`/get-started/${product}/generate-items`}
          businessId={result.business.id}
        />
      </div>
      <QrCreator business={result.business} product={product} url={url} />
    </section>
  );
}
