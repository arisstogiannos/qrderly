import {
  Brain,
  Brush,
  LayoutDashboard,
  Palette,
  Phone,
  QrCode,
  Smartphone,
} from "lucide-react";
import {
  OrderIcon,
  OrderReceiveIcon,
  TranslationIcon,
} from "./app/[locale]/(website)/products/_components/Icons";
import { Product } from "@prisma/client";
import { ProductURL } from "./types";

export const plandata = [
  {
    title: "QR Menu",
    product: Product.QR_MENU,
    billing: {
      yearly: {
        price: "€9/month",
        payment_link: "https://buy.stripe.com/test_cN28x83sd9qN0ik4gg",
        price_id: "price_1RE55fP01OOv4UZm3ZiOeT0q",
      },
      monthly: {
        price: "€12/month",
        payment_link: "https://buy.stripe.com/test_eVafZA4wh46t9SUfYZ",
        price_id: "price_1RE55fP01OOv4UZm1ybw7Zxy",
      },
    },
    bullets: [
      "Unlimited scans",
      "Free customizable QR code",
      "Customerizable themes & templates",
      "Free Hosting",
      "Manage your menu in real time",
      "Add unlimited products & categories",
      "Multi-language support (up to 30)",
      "No app download required",
    ],
    free: [
      "Unlimited Traffic",
      "Unlimited Products & Categories",
      "Free Hosting",
      "200 Qr Scans",
    ],
    pro: [
      "Unlimited Traffic",
      "Unlimited Products & Categories",
      "Free Hosting",
      "Unlimited Qr Scans",
    ],
  },
  {
    title: "Smart Ordering QR Menu",
    product: Product.SMART_QR_MENU,
    billing: {
      yearly: {
        price: "€14/month",
        payment_link: "https://buy.stripe.com/test_eVa6p04wh6eB8OQaEG",
        price_id: "price_1RE55aP01OOv4UZmdFEjU2IK",
      },
      monthly: {
        price: "€18/month",
        payment_link: "https://buy.stripe.com/test_eVa6p04wh6eB8OQaEG",
        price_id: "price_1RE55bP01OOv4UZmGsAmpuhW",
      },
    },
    bullets: [
      "All features of the QR Menu plan",
      "Generate 1 QR code per table for identification",
      "Customers can place orders directly from their phones",
      "Real-time order notifications for your staff",
      "Indexed in search engines",
    ],
    free: [
      "Unlimited Traffic",
      "Unlimited Products & Categories",
      "Unlimited Orders",
      "Free Hosting",
      "200 Qr Scans",
    ],
    pro: [
      "Unlimited Traffic",
      "Unlimited Products & Categories",
      "Unlimited Orders",
      "Free Hosting",
      "Unlimited Qr Scans",
    ],
  },
  {
    title: "Smart Self Service Menu",
    product: Product.SELF_SERVICE_QR_MENU,
    billing: {
      yearly: {
        price: "€16/month",
        payment_link: "https://buy.stripe.com/test_cN28x83sd9qN0ik4gg",
        price_id: "price_1RE55XP01OOv4UZmQfhk0VUW",
      },
      monthly: {
        price: "€20/month",
        payment_link: "https://buy.stripe.com/test_eVafZA4wh46t9SUfYZ",
        price_id: "price_1RE55XP01OOv4UZmgkN2RXJS",
      },
    },
    bullets: [
      "All features of the Smart QR Menu plan",
      "Customers receive notification when their order is ready",
      "Customers can place orders for takeaway",
    ],
    free: [
      "Unlimited Traffic",
      "Unlimited Products & Categories",
      "Unlimited Orders",
      "Free Hosting",
      "200 Qr Scans",
    ],
    pro: [
      "Unlimited Traffic",
      "Unlimited Products & Categories",
      "Unlimited Orders",
      "Free Hosting",
      "Unlimited Qr Scans",
    ],
  },
];

export const productsData = [
  {
    title: "QR Menu",
    desc: "Say goodbye to printed menus and hello to a modern, hassle-free dining experience. With our QR Menu, your customers can simply scan a QR code using their smartphones and instantly access your digital menu—no downloads, no delays, no apps needed.",
    link: "qr-menu",
    shortDesc:
      "Let your customers scan a QR code and instantly access your digital menu—no apps, no hassle. Keep your menu always up-to-date while reducing printing costs.",

    videoPath: "/QR animation.webm",
    steps: [
      "Create & Customize Your Digital Menu - Once you create your account and choose your plan, you will be able to add and personalize your menu in no time.",
      "Generate A Unique QR Code - Print and display on booklets, counters, or marketing materials.",
      "Customers Scan & Browse - Customers can instantly access your menu on their phones by scanning the QR code.",
      "Manage Your Menu With Ease - Control through a user-friendly admin panel, where you can update, edit, or remove items in real-time.",
    ],
    features: [
      {
        title: "Effortless Digital Menu from Images & PDFs!",
        desc: "Instantly convert your photo or PDF menu into a digital menu with AI-powered accuracy. No manual entry—just upload and let AI do the work!",
        video: "/videos/AI-MENU.webm",
        icon: <Brain size={"2rem"} />,
      },
      {
        title: "Real-Time Dashboard",
        desc: "Effortlessly update menu items, descriptions, and prices with just a few clicks. No need to reprint menus—changes reflect instantly across all customer devices.",
        video: "/videos/dashboard-add-item.webm",
        icon: <LayoutDashboard size={"2rem"} />,
      },
      {
        title: "Instant Digital Menu Access",
        desc: "Guests simply scan a QR code to view the menu instantly on their smartphones. No app downloads required—just fast, convenient, and touch-free browsing.",
        video: "/videos/QR animation.webm",
        icon: <Smartphone size={"2rem"} />,
      },
      {
        title: "Multi-Language Support",
        desc: "Cater to international customers with multilingual menus. Guests can switch between languages effortlessly, improving accessibility and customer satisfaction.",
        video: "/videos/multi-language.webm",
        icon: <TranslationIcon />,
      },
      {
        title: "Customizable Themes",
        desc: "Tailor your digital menu with our easy-to-use color theme maker to reflect your business's identity. Ensure a visually appealing experience for your guests.",
        video: "/videos/customizeable-no-cart.webm",
        icon: <Palette size={"2rem"} />,
      },
    ],
  },

  {
    title: "Smart Ordering QR Menu",
    link: "smart-ordering-qr-menu",
    desc: "Take your QR Menu to the next level by allowing customers to browse, order, and pay directly from their phones. Enhance efficiency, reduce wait times, and improve the overall customer experience.",
    shortDesc:
      "Take your QR menu to the next level! Allow customers to browse your menu, place orders — all without waiting for a waiter. Faster service, happier customers, and increased efficiency.",
    videoPath: "/smart QR animation.webm",
    steps: [
      "Setup The Menu - The interface simplifies the setup of the QR menu, with some extra configuration like stock & quantity or payment integration.",
      "Browse & Select Items - Guests add items to their carts, select preferences, and place the order directly from their phones.",
      "Order Sent To The Admin Panel - The order instantly appears in your admin dashboard, where you can manage and track it in real-time.",
      "Fulfill Order - Once the order is completed by the staff.",
    ],
    features: [
      {
        title: "Effortless Digital Menu from Images & PDFs!",
        desc: "Instantly convert your photo or PDF menu into a digital menu with AI-powered accuracy. No manual entry—just upload and let AI do the work!",
        video: "/videos/AI-MENU.webm",
        icon: <Brain size={"2rem"} />,
      },
      {
        title: "Multi-Language Support",
        desc: "Cater to international customers with multilingual menus. Guests can switch between languages improving accessibility and customer satisfaction.",
        video: "/videos/multi-language.webm",
        icon: <TranslationIcon />,
      },
      {
        title: "Seamless QR Ordering",
        desc: "Guests can browse, select items, and place orders directly from the digital menu.",
        video: "/videos/order.webm",
        icon: <OrderIcon color="#155e95" />,
      },
      {
        title: "Real-Time Dashboard",
        desc: "Effortlessly update menu items, descriptions, and prices with just a few clicks. No need to reprint menus—changes reflect instantly across all customer devices.",
        video: "/videos/dashboard-add-item.webm",
        icon: <LayoutDashboard size={"2em"} />,
      },
      {
        title: "Instant Digital Menu Access",
        desc: "Guests simply scan a QR code to view the menu instantly on their smartphones. No app downloads required—just fast, convenient, and touch-free browsing.",
        video: "/videos/QR animation.webm",
        icon: <Smartphone size={"2em"} />,
      },
      {
        title: "Customizable Themes",
        desc: "Tailor your digital menu with our easy-to-use color theme maker to reflect your business's identity. Ensure a visually appealing experience for your guests.",
        video: "/videos/customizeable-no-cart.webm",
        icon: <Palette size={"2em"} />,
      },
      {
        title: "Real-Time Order Management",
        desc: " Orders appear instantly in your Admin Dashboard, ensuring smooth operations.",
        video: "/videos/receive-order.webm",
        icon: <OrderReceiveIcon color="#155e95" />,
      },
    ],
  },
  {
    title: "Self Service Smart Menu",
    desc: "Enhance your restaurant or café with a QR ordering system! Customers can scan, order from their table, and only pick up their order when it’s ready—no waiting, no interruptions. Improve service efficiency while staying in full control.",
    link: "self-service-smart-menu",

    shortDesc:
      "Customers can scan, order from their table, and only pick up their order when it’s ready—no waiting, no interruptions. Improve service efficiency while staying in full control.",
    videoPath: "/smart QR animation.webm",
    steps: [
      "Set Up Your Online Store - Customize your menu, pricing, and branding by following the exact same steps as setting up a QR menu.",
      "Place Orders For Delivery Or Takeaway - Customers choose their preferred option and complete payment securely online.",
      "Order Sent To The Admin Panel - The order instantly appears in your admin dashboard, where you can manage and track it in real-time.",
      "Prepare & Fulfill Orders - Notify customers when their order is ready for pickup or out for delivery.",
    ],
    features: [
      {
        title: "Effortless Digital Menu from Images & PDFs!",
        desc: "Instantly convert your photo or PDF menu into a digital menu with AI-powered accuracy. No manual entry—just upload and let AI do the work!",
        video: "/videos/AI-MENU.webm",
        icon: <Brain size={"2rem"} />,
      },
      {
        title: "Customizable Themes",
        desc: "Personalize your menu with colors, fonts, and branding to match your business style.",
        video: "/videos/customizeable-no-cart.webm",
        icon: <Brush />,
      },
      {
        title: "Real-Time Dashboard",
        desc: "Effortlessly update menu items, descriptions, and prices with just a few clicks. No need to reprint menus—changes reflect instantly across all customer devices.",
        video: "/videos/dashboard-add-item.webm",
        icon: <LayoutDashboard size={"2em"} />,
      },
      {
        title: "Instant Digital Menu Access",
        desc: " Guests scan a QR code to view your menu instantly on their smartphones.",
        video: "/videos/QR animation.webm",
        icon: <Brush />,
      },
      {
        title: "Multi-Language Support",
        desc: "Offer your menu in multiple languages to accommodate international customers.",
        video: "/videos/multi-language.webm",
        icon: <Brush />,
      },
    ],
  },
];

export const faqData = [
  {
    question: "How does the QR menu work?",
    answer:
      "Once you create your restaurant’s digital menu, we generate a unique QR code for you. Simply print and place it on tables or counters. Customers scan the QR code with their smartphones and instantly access your up-to-date menu—no apps needed!",
  },
  {
    question: "Can customers place orders directly from the QR menu?",
    answer:
      "Yes! With our QR Menu with Ordering feature, customers can browse, select items, and place orders directly from their phones. Orders are instantly sent to your admin dashboard, allowing you to manage them in real-time.",
  },
  {
    question: "How does online ordering for delivery & takeaway work?",
    answer:
      "We provide you with a custom online ordering page where customers can place orders for delivery or pickup. No third-party commissions—just direct sales through your platform. Payments are processed securely via Stripe.",
  },
  {
    question: "Do I need technical knowledge to set this up?",
    answer:
      "Not at all! Our system is user-friendly and requires no coding skills. You can manage menus, orders, and settings easily from your admin dashboard.",
  },
  {
    question: "How are payments processed?",
    answer:
      "We integrate with Stripe to handle all payments securely. Customers can pay online, and funds go directly to your Stripe account.",
  },
  {
    question: "Can I update my menu anytime?",
    answer:
      "Yes! You can add, edit, or remove items instantly from your admin dashboard. Changes are updated in real-time, so your customers always see the latest version of your menu.",
  },
  {
    question: "Is there a commission fee on my sales?",
    answer:
      "No, we don’t take a percentage of your sales! You keep 100% of your earnings, minus standard Stripe processing fees.",
  },
  {
    question: "Can I use this for multiple locations?",
    answer:
      "Yes! If you own multiple restaurants or branches, you can manage them all from a single dashboard, with separate menus, QR codes, and settings for each location.",
  },
  {
    question: "What if I need help setting up?",
    answer:
      "Our support team is always here to help! We offer step-by-step guides and direct support to ensure your setup is smooth and hassle-free.",
  },
];

export const productMap = {
  "qr-menu": Product.QR_MENU,
  "smart-ordering-qr-menu": Product.SMART_QR_MENU,
  "self-service-smart-menu": Product.SELF_SERVICE_QR_MENU,
};
export const productMapURL: Record<Product, ProductURL> = Object.fromEntries(
  Object.entries(productMap).map(([key, value]) => [value, key])
) as Record<Product, ProductURL>;

export const productPath = {
  "qr-menu": "menu",
  "smart-ordering-qr-menu": "smart-menu",
  "self-service-smart-menu": "smart-menu",
};

export const themes = {
  T1: [
    "#0F172A,#1E293B,#3B82F6,#F8FAFC", // Professional & clean
    "#111111,#161616,#591F5E,#F1F1F1", // Original Dark Plum
    "#1F2937,#374151,#10B981,#F9FAFB", // Cool modern
    "#F2E9E4,#C9ADA7,#9A8C98,#222222", // Blush/Muted Elegant
    "#FAF3E0,#EBD9C4,#8A4B2D,#2D1E17",
    "#CBD2A4,#E9EED9,#9A7E6F,#54473F", // Original Pastel Olive

    "#F5F5F0,#DCE4D6,#5C8374,#2E3A2C",
    "#FDF6EC,#D9BF77,#A44A3F,#2C2C2C", // 🥘 Rustic Mediterranean
    "#FAF3E0,#FAD6A5,#FF6701,#1A120B", // 🍳 Bright Brunch Café
  ],
  T2: [
    "#0F172A,#1E293B,#3B82F6,#F8FAFC", // Professional & clean
    "#111111,#202020,#591F5E,#F1F1F1", // Original Dark Plum
    "#1F2937,#374151,#10B981,#F9FAFB", // Cool modern
    "#F2E9E4,#C9ADA7,#9A8C98,#222222", // Blush/Muted Elegant
    "#FAF3E0,#EBD9C4,#8A4B2D,#2D1E17",
    "#CBD2A4,#E9EED9,#9A7E6F,#54473F", // Original Pastel Olive

    "#F5F5F0,#DCE4D6,#5C8374,#2E3A2C",
    "#FDF6EC,#D9BF77,#A44A3F,#2C2C2C", // 🥘 Rustic Mediterranean
    "#FAF3E0,#FAD6A5,#FF6701,#1A120B", // 🍳 Bright Brunch Café
  ],
};
