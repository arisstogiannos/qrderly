import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "el"],

  // Used when no locale matches
  defaultLocale: "en",
  pathnames: {
    "/": "/",
    "/en": "/en",
    "/el": "/el",
    "/FAQ-contact": {
      el: "/FAQ-επικοινωνία",
      en: "/FAQ-contact",
    },
    "/products/qr-menu": {
      el: "/προιόντα/qr-μενού",
      en: "/products/qr-menu",
    },
    "/products/smart-ordering-qr-menu": {
      el: "/προιόντα/qr-μενού-με-παραγγελίοληψία",
      en: "/products/smart-ordering-qr-menu",
    },
    "/products/self-service-smart-menu": {
      el: "/προιόντα/qr-μενού-με-παραγγελίοληψία-self-service",
      en: "/products/self-service-smart-menu",
    },
    "/pricing": {
      el: "/τιμές",
      en: "/pricing",
    },
    "/sign-up": {
      el: "/εγγραφή",
      en: "/sign-up",
    },
    "/reset-password": {
      el: "/επαναφορά-κωδικού",
      en: "/reset-password",
    },
    "/login": {
      el: "/σύνδεση",
      en: "/login",
    },
    "/get-started": {
      el: "/ξεκινήστε-τώρα",
      en: "/get-started",
    },
    "/get-started/[product]/business-setup":
      "/get-started/[product]/business-setup",
    "/get-started/[product]/menu-settings":
      "/get-started/[product]/menu-settings",
    "/get-started/[product]/generate-items":
      "/get-started/[product]/generate-items",
    "/get-started/[product]/customize-qr":
      "/get-started/[product]/customize-qr",
    "/get-started/[product]/publish": "/get-started/[product]/publish",

    "/[businessName]/menu": "/[businessName]/menu",
    "/[businessName]/smart-menu": "/[businessName]/smart-menu",

    "/[businessName]/dashboard": {
      el: "/[businessName]/πίνακας ελέγχου",
      en: "/[businessName]/dashboard",
    },
    "/[businessName]/dashboard/menu-items": {
      el: "/[businessName]/πίνακας ελέγχου/προιόντα",
      en: "/[businessName]/dashboard/menu-items",
    },
    "/[businessName]/dashboard/categories": {
      el: "/[businessName]/πίνακας ελέγχου/κατηγορίες",
      en: "/[businessName]/dashboard/categories",
    },
    "/[businessName]/dashboard/upload-menu": {
      el: "/[businessName]/πίνακας ελέγχου/ανέβασμα-μενού",
      en: "/[businessName]/dashboard/upload-menu",
    },
    "/[businessName]/dashboard/all-orders": {
      el: "/[businessName]/πίνακας ελέγχου/παραγγελίες",
      en: "/[businessName]/dashboard/all-orders",
    },
    "/[businessName]/dashboard/settings": {
      el: "/[businessName]/πίνακας ελέγχου/ρυθμίσεις",
      en: "/[businessName]/dashboard/settings",
    },
    "/[businessName]/dashboard/qr": {
      el: "/[businessName]/πίνακας ελέγχου/ρυθμίσεις-qr",
      en: "/[businessName]/dashboard/qr",
    },
    "/[businessName]/dashboard/live-orders": {
      el: "/[businessName]/πίνακας ελέγχου/ζωντανές-παραγγελίες",
      en: "/[businessName]/dashboard/live-orders",
    },
    "/en/[businessName]/menu": "/en/[businessName]/menu",
    "/en/[businessName]/smart-menu": "/en/[businessName]/smart-menu"
   
  },
});
