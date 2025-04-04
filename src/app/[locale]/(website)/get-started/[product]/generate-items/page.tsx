import { ProductURL } from '@/types';
import { notFound, redirect } from 'next/navigation';
import React from 'react'
import { checkUser } from '../../isAllowed';
import UploadingForm from '../../_components/generateItems/UploadingForm';

export default async function page({
  params,
}: {
  params: Promise<{ product: ProductURL }>;
}) {
  const product = (await params).product;
  if (!product) notFound();
 

  const result = await checkUser(product);
   if (!result) {
      redirect("/get-started/" + product + "/business-setup");
    }
    if (result?.redirect === "businessWithoutMenu") {
      redirect("/get-started/" + product + "/menu-settings");
    }
    if (result.redirect === "unpublishedMenu" || result.redirect === "noUnsetBusiness") {
      redirect("/get-started/" + product + "/publish");
    }
  return (
    <div className='space-y-8'>
      <header className='max-w-xl space-y-2'>

      <h1 className='text-2xl font-medium'>Upload your menu</h1>
      <p>Our AI will automatically populate your menu for you. All you have to do is upload an image or pdf. If you want to manually insert all the items click skip.</p>
      </header>

    <UploadingForm businessName={result.business.name ??""}/>
    </div>
  )
}
