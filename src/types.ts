import type {
  Business,
  Category,
  Menu,
  MenuItem,
  Order,
  OrderItem,
  OrderStatus,
  QR,
  Subscription,
  UserRole,
} from '@prisma/client';
import type { User } from 'next-auth';
import type { ReactNode } from 'react';

export type ProductType = {
  title: string;
  desc: string;
  link: string;
  shortDesc: string;
  videoPath: string;
  steps: string[];
  features: FeatureType[];
};

export type Option = {
  name: string;
  type: 'single' | 'multiple';
  values: { name: string; price: string }[];
};

export type ProductURL = 'qr-menu' | 'smart-ordering-qr-menu' | 'self-service-smart-menu';

export type Cart = Order & {
  cartItems: CartItem[];
};
export type OrderWithItems = Omit<Order, 'businessId'> & {
  createdAt: Date;
  orderItems: OrderItemWithMenuItem[];
};
export type OrderItemWithMenuItem = OrderItem & {
  menuItem: MenuItem;
};

export type CartItem = {
  id: string;
  menuItem: MenuItemRequired;
  quantity: number;
  preferences: string;
  price: number;
};

export type MenuItemRequired = Omit<
  MenuItem,
  'stock' | 'isAvailable' | 'createdAt' | 'categoryId' | 'menuId' | 'updatedAt'
>;

export type FeatureType = {
  icon: ReactNode;
  title: string;
  video: string;
  desc: string;
};

export type BusinessExtended = Business & {
  menu: Menu | undefined;
  subscription: Subscription | undefined;
  qr: QR | undefined;
};

export type ExtendedSubscription = Subscription & {
  business: BusinessExtended | undefined;
};

export type ExtendedUser = {
  role: UserRole;
  business: BusinessExtended[];
  subscriptions: ExtendedSubscription[];
} & User;

export type Language = {
  code: string;
  name: string;
};
export type MenuItemWithCategory = MenuItem & {
  category: {
    name: string;
  };
};
export type Translation = Record<
  string,
  {
    name: string | null;
    description: string | undefined | null;
    preferences: { name: string; values: string[] }[] | null;
  }
>;
export type TranslationAI = {
  languageCode: string;
  name: string | null;
  description: string | null | undefined;
  preferences: { name: string; values: string[] }[] | null;
};

export type CategoryWithItemCount = Category & {
  _count: {
    menuItems: number;
  };
};

export type MenuItemAI = {
  name: string;
  description: string | null;
  category: string;
  categoryDescription: string;
  priceInCents: number;
  preferences: Option[] | null;
  translations: TranslationAI[];
};

export type RequiredOrder = {
  id: string;
  price: number;
  status: OrderStatus;
  orderItems: {
    quantity: number;
    menuItem: {
      name: string;
      priceInCents: number;
    };
  }[];
};
