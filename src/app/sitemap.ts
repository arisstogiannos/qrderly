import { db } from "@/db";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Metadata, MetadataRoute } from "next";
import { Locale } from "next-intl";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const businesses = await db.business.findMany();

  const menuUrls: MetadataRoute.Sitemap = businesses.map((b) => ({
    url: `${baseUrl}/en/${b.name.replaceAll(" ", "-")}/${b.product === "QR_MENU" ? "menu" : "smart-menu"}`,
  }));


  return [
    ...getEntries("/"),
    ...getEntries("/FAQ-contact"),
    ...getEntries("/get-started"),
    ...getEntries("/login"),
    ...getEntries("/pricing"),
    ...getEntries("/products/qr-menu"),
    ...getEntries("/products/self-service-smart-menu"),
    ...getEntries("/products/smart-ordering-qr-menu"),
    ...getEntries("/reset-password"),
    ...getEntries("/sign-up"),
    ...menuUrls,
  ];
}

type Href = Parameters<typeof getPathname>[0]["href"];

function getEntries(href: Href):MetadataRoute.Sitemap{
  return routing.locales.map((locale) => ({
    url: getUrl(href, locale),
    alternates: {

      languages: Object.fromEntries(
        routing.locales.map((cur) => [cur, getUrl(href, cur)])
      ),
    },
  }));
}

function getUrl(href: Href, locale: Locale) {
  const pathname = getPathname({ locale, href });
  return baseUrl + pathname;
}
