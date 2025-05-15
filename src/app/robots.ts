import { db } from "@/db";
import type{ MetadataRoute } from "next";
const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const businesses = await db.business.findMany();

  const dashboards = businesses.flatMap((b) =>
    ["en", "el"].map((locale) =>
      locale === "en"
        ? `/${locale}/${b.name.replaceAll(" ", "-")}/dashboard`
        : `/${locale}/${b.name.replaceAll(" ", "-")}/πινακας-ελεγχου`
    )
  );

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: dashboards,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
