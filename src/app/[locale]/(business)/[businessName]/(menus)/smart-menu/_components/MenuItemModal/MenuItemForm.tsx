'use client';
import { useTranslations } from 'next-intl';

import { type FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useCardModalContext } from '@/context/CardModalProvider';
import { useCartContext } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import type { MenuItemRequired } from '@/types';
import MenuItemModalFooter from './MenuItemModalFooter';
import MenuItemVersionsInCart from './MenuItemVersionsInCart';
import Options from './Options';

export default function MenuItemOptionsForm({
  menuItem,
  setOpen,
}: {
  menuItem: MenuItemRequired;
  setOpen: (value: boolean) => void;
}) {
  const { cartItems, addToCart, updateCartItem } = useCartContext();
  const t = useTranslations('menus.order');
  const existingMenuItems = cartItems.filter((item) => item.menuItem.id === menuItem.id);
  const [cartItemVersionId, setCartItemVersionId] = useState<string>(
    !menuItem.preferences && existingMenuItems.length > 0 ? existingMenuItems[0].id : '',
  );
  const { setPrice, price } = useCardModalContext();

  useEffect(() => {
    setPrice(menuItem.priceInCents);
  }, [menuItem.priceInCents]);

  const existingMenuItem = existingMenuItems.find((item) => item.id === cartItemVersionId);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    const dataAsString = JSON.stringify(data)
      .replaceAll(`"`, '')
      .replaceAll(',', ', ')
      .slice(1, -1);
    if (cartItemVersionId === '') {
      addToCart(menuItem, dataAsString, price);
    } else {
      updateCartItem(dataAsString, cartItemVersionId, price);
    }
    toast.success(t('toast'), {
      duration: 1500,
    });
    setOpen(false);
  }

  return (
    <form className={cn('grid items-start gap-6')} onSubmit={handleSubmit}>
      {existingMenuItems.length > 0 && menuItem.preferences && (
        <MenuItemVersionsInCart
          setCartItemVersionId={setCartItemVersionId}
          cartItemVersionId={cartItemVersionId}
          existingMenuItems={existingMenuItems}
        />
      )}
      <Options
        translations={menuItem.translations}
        options={menuItem.preferences ?? ''}
        existingOptions={existingMenuItem?.preferences}
      />
      <MenuItemModalFooter item={existingMenuItem} />
    </form>
  );
}
