"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { z } from "zod";

const businessSchema = z.object({
  name: z.string(),
  type: z.string(),
  country: z.string(),
  city: z.string(),
});

export async function submitBusinessInfo(prevstate: any, formData: FormData) {
  const result = businessSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const data = result.data;
  const existingBusiness = await db.business.findFirst({
    where: { name: data.name },
  });

  if (existingBusiness) {
    return {
      errors: {
        name: ["bussiness name already exists. Try adding a number"],
      },
    };
  }
  const session = await auth();
  const user = session?.user;

  if (!user?.id) {
    redirect("/unauthorized");
  }
  try {
    await db.business.create({
      data: {
        name: data.name,
        location: data.country + " - " + data.city,
        type: data.type,
        userId: user.id,
      },
    });
  } catch {
    return {
      error: "Something went wrong!",
    };
  }

  redirect(`/get-started/menu-settings`);
}

const menuSettingsSchema = z.object({
  language: z.string(),
  theme: z.string(),
});
export async function submitMenuSettings(
  businessId: string,
  subscriptionId:string,
  prevstate: any,
  formData: FormData
) {
  const result = menuSettingsSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const data = result.data;

  try {
    await db.menu.create({
      data: {
        languages: data.language,
        theme: data.theme,
        businessId,
      },
    });
  } catch {
    return {
      error: "Something went wrong",
    };
  }

  redirect("/get-started/generate-QR")
}
