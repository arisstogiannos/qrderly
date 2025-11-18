'use server';

import type { BillingType, Menu, Product, Template } from '@prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Options } from 'qr-code-styling';
import { z } from 'zod';
import { auth } from '@/auth';
import { productMap, productMapURL } from '@/data';
import { db } from '@/db';
import { sendFeedbackEmail, sendMenuCreatedEmail } from '@/email/mail';
import getSession from '@/lib/getSession';
import { encryptTable } from '@/lib/table-crypt';
import type { ProductURL } from '@/types';

const businessSchema = z.object({
  name: z.string(),
  type: z.string(),
  country: z.string(),
  currency: z.string(),
  tables: z.string().optional(),
});

export async function submitBusinessInfo(
  product: ProductURL,
  existingBusinessId: string | undefined,
  prevstate: any,
  formData: FormData,
) {
  const result = businessSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const data = result.data;
  if (!existingBusinessId) {
    const existingBusiness = await db.business.findUnique({
      where: { name: data.name },
    });

    if (existingBusiness) {
      return {
        errors: {
          name: ['bussiness name already exists. Try adding a number'],
        },
      };
    }
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
      redirect('/unauthorized');
    }
    const freebusinesses = user.business.filter(
      (b) => b.subscription && b.subscription.billing === 'FREETRIAL',
    );

    if (freebusinesses.length > 3) {
      return {
        error: 'You have more than 3 free menus. You have to upgrade to pro.',
      };
    }
    try {
      await db.business.create({
        data: {
          name: data.name,
          location: data.country,
          type: data.type,
          userId: user.id,
          product: productMap[product],
          tables: data.tables,
          currency: data.currency,
        },
      });
    } catch (err) {
      console.error(err);
      return {
        error: 'Something went wrong!',
      };
    }
  } else {
    try {
      await db.business.update({
        where: { id: existingBusinessId },
        data: {
          name: data.name,
          location: data.country,
          type: data.type,
          currency: data.currency,
          tables: data.tables,
        },
      });
    } catch (err) {
      console.error(err);
      return {
        error: 'Something went wrong!',
      };
    }
  }
  redirect(`/get-started/${product}/menu-settings`);
  // return { success: true };
}

const menuSettingsSchema = z.object({
  defaultLanguage: z.string().nonempty({ message: 'Required field' }),
  language: z.string().nonempty({ message: 'Required field' }),
  template: z.string().nonempty({ message: 'Required field' }),
  background: z.string(),
  secondary: z.string(),
  primary: z.string(),
  text: z.string(),
});
export async function submitMenuSettings(
  businessId: string,
  product: Product,
  menu: Menu | undefined,
  setup: boolean,
  prevstate: any,
  formData: FormData,
) {
  const result = menuSettingsSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { defaultLanguage, language, background, secondary, primary, text, template } = result.data;

  const selectedTheme = `${background},${secondary},${primary},${text}`;

  try {
    if (menu) {
      await db.menu.update({
        where: { id: menu.id },
        data: {
          languages: `${defaultLanguage},${language}`,
          theme: selectedTheme,
          businessId,
          type: product,
          template: template as Template,
        },
      });
    } else {
      await db.menu.create({
        data: {
          languages: `${defaultLanguage},${language}`,
          theme: selectedTheme,
          businessId,
          type: product,
          template: template as Template,
        },
      });
    }
  } catch {
    return {
      error: 'Something went wrong',
    };
  }
  if (setup) redirect(`/get-started/${productMapURL[product]}/generate-items`);

  const session = await getSession();

  const business = session?.user.business.find((b) => b.id === businessId);
  revalidateTag(`active-menu${business?.name}`, 'max');
  return { success: 'Changes saved!' };
}

export async function createMenu(product: ProductURL, tier: BillingType, businessId: string) {
  const user = (await auth())?.user;

  if (!user?.id) {
    return { error: 'Sign in first' };
  }

  const business = user.business.find(
    (b) => b.menu?.published === false && b.product === productMap[product],
  );

  if (!business) {
    return {
      error:
        'You dont have a business to create menu for-Either you havent create any business either you already have menus for all your businesses',
    };
  }

  // const runningJob = (await cookies()).get("inngestEventId");
  // if (runningJob) {
  //   const job = await getRunOutput(runningJob.value);
  //   if (job.status !== "Completed") {
  //     return {
  //       error: "Something went wrong with menu creation",
  //     };
  //   }
  // }

  const existingSub = user.subscriptions.find(
    (s) =>
      (s.businessId == null || s.businessId === businessId) &&
      s.billing === tier &&
      s.product === productMap[product],
  );

  try {
    if (existingSub) {
      await db.subscription.update({
        where: { id: existingSub.id },
        data: {
          businessId: business.id,
        },
      });
    } else {
      await db.subscription.create({
        data: {
          billing: tier,
          expiresAt: new Date(),
          product: productMap[product],
          userId: user.id,
          businessId: business.id,
        },
      });
    }
  } catch (err) {
    console.error(err);
    return {
      error: 'Something went wrong-Please go back to step 1 and try again.',
    };
  }

  const menu = await db.menu.update({
    where: { businessId: business.id },
    data: { published: true },
  });

  revalidateTag(`active-menu${business.name}`, 'max');
  revalidateTag('active-menus', 'max');
  revalidatePath(`/en/${business.name.replaceAll(' ', '-')}`);
  revalidatePath(`/en/${business.name.replaceAll(' ', '-')}/menu`);
  revalidatePath(`/en/${business.name.replaceAll(' ', '-')}/smart-menu`);

  const adminEncryptedTableId = await encryptTable(`admin|${business.name}`);
  const businessNameUrl = business.name.replaceAll(' ', '-');

  await saveQR(
    business.id,
    {
      data: `${process.env.NEXT_PUBLIC_SERVER_URL}/${businessNameUrl}/${menu.type === 'QR_MENU' ? 'menu' : 'smart-menu'}`,
      height: 300,
      width: 300,
      margin: 10,
    },
    'Scan For Menu',
  );

  if (user.email) {
    await Promise.all([
      sendMenuCreatedEmail(
        user.email,
        user.name ?? 'user',
        business.name,
        menu.type === 'QR_MENU' ? 'menu' : `smart-menu?table=${adminEncryptedTableId}`,
      ),
      sendFeedbackEmail(user.email, user.name ?? 'user'),
    ]);
  }

  return {
    success: 'Proccess Complete',
    businessNameUrl,
    adminEncryptedTableId,
  };
}

// export async function generateQR(business:BusinessExtended){

//   const url =
//     process.env.NEXT_PUBLIC_SERVER_URL +
//     "/" +
//     business.name.replaceAll(" ", "-") +
//     "/" +
//     productPath[product];

//   const qrApiEndpoint = `http://api.qrserver.com/v1/create-qr-code/?data=${url}&size=500x500`;

//   let blob;
//   try {
//     const response = await fetch(qrApiEndpoint);
//     blob = await response.blob();

//     // URL.revokeObjectURL(url); // Clean up
//   } catch (error) {
//     return { error: "Failed to generate QR." };
//   }
//   let dataUrl = "";
//   const reader = new FileReader();
//   reader.readAsDataURL(blob);
//   reader.onloadend = function () {
//     dataUrl = reader.result as string;
//   };
//   await db.qR.create({
//     data: {
//       link: url,
//       menuId: menu.id,
//       table: "0",
//       type: "menu",
//       businessId: business.id,
//       imageSrc: dataUrl,
//     },
//   });
// }
export async function saveQR(
  businessId: string,
  qrOptions: Options,
  text: string,
  product?: ProductURL,
) {
  const { imageOptions, ...rest } = qrOptions;
  try {
    await db.qR.upsert({
      where: { businessId },
      create: {
        link: qrOptions.data ?? '',
        businessId,
        qrOptions: JSON.stringify({ ...rest }),
        text,
      },
      update: {
        link: qrOptions.data ?? '',
        businessId,
        qrOptions: JSON.stringify({ ...rest }),
        text,
      },
    });
    // revalidatePath(`/en/${business.name.replaceAll(" ", "-")}/dashboard`);
    // revalidatePath(`/el/${business.name.replaceAll(" ", "-")}/dashboard`);
  } catch (err) {
    console.error(err);
    return { error: 'Something went wrong!' };
  }
  if (product) {
    redirect(`/get-started/${product}/publish`);
  }
  return { success: 'QR code saved!' };
}
