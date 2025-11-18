'use client';
import { MenuIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import type React from 'react';
import { forwardRef, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import CreateMenuBtn from './CreateMenuBtn';
import I18nLanguageSelect from './I18nLanguageSelect';
import Menu from './Menu';
import { ProfileDropdown } from './ProfileDropdown';
import { Button } from './ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'QR Menu',
    href: '/products/qr-menu',
    description: 'Let your customers scan a QR code and instantly access your digital menu',
  },
  {
    title: 'Smart QR Menu',
    href: '/products/smart-ordering-qr-menu',
    description: 'Allow your customers to browse and order directly from their phones',
  },
  {
    title: 'Self Service QR Menu',
    href: '/products/self-service-smart-menu',
    description: 'Your customers order through the menu and will be notified when its ready',
  },
];

type hrefType =
  | '/products/qr-menu'
  | '/products/smart-ordering-qr-menu'
  | '/products/self-service-smart-menu';

export function NavigationDesktop() {
  const t = useTranslations('navbar');
  const { data: session } = useSession();
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/">{t('Home')}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="">
          <NavigationMenuTrigger>{t('Products')}</NavigationMenuTrigger>
          <NavigationMenuContent className="bg-foreground rounded-2xl">
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[300px] bg-foreground text-background  rounded-xl">
              {/* <li className="row-span-3">
                <NavigationMenuLink asChild asChild className="bg-foreground pointer-events-none">
                  <div
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-black p-6 no-underline outline-none focus:shadow-md"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      shadcn/ui
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Beautifully designed components built with Radix UI and
                      Tailwind CSS.
                    </p>
                  </div>
                </NavigationMenuLink>
              </li> */}
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={t(`${component.title}.title`)}
                  href={component.href as hrefType}
                >
                  {t(`${component.title}.description`)}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/pricing">{t('Pricing')}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="mr-2">
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/FAQ-contact">{t('FAQ/Contact')}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <I18nLanguageSelect />

        {!session ? (
          <Button asChild className="lg:bg-foreground ml-2 p-4 mr-2  text-lg">
            <Link href={'/sign-up'} className="">
              {t('signBtn')}
            </Link>
          </Button>
        ) : (
          <CreateMenuBtn session={session} />
        )}
        {session ? <ProfileDropdown session={session} /> : null}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<typeof Link>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li className="hover:bg-background/10 rounded-xl transition-all duration-300">
        <NavigationMenuLink asChild className="hover:text-primary">
          <Link ref={ref} {...props}>
            <div className={cn('block select-none space-y-1 rounded-md p-3 ', className)}>
              <div className="text-sm font-medium leading-none">{title}</div>
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
            </div>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = 'ListItem';

// export function NavLinks({ session }: { session: Session | null }) {
//   return (
//     <nav className=" flex gap-6 items-center lg:text-xl flex-col lg:flex-row  max-lg:justify-center h-full text-2xl ">
//       <NavLink href={"/"}>Home</NavLink>
//       <NavLink href={"/products"}>Products</NavLink>
//       <NavLink href={"/pricing"}>Pricing</NavLink>
//       <NavLink href={"/FAQ-contact"}>FAQ/Contact</NavLink>
//       <Button asChild className="lg:bg-foreground ml-2 p-4  text-lg">
//         {!session ? (
//           <Link href={"/sign-up"} className="">
//             Sign Up
//           </Link>
//         ) : (
//           <Link href={"/get-started"} className="">
//             Create Menu
//           </Link>
//         )}
//       </Button>
//       {session ? <ProfileDropdown session={session} /> : null}
//     </nav>
//   );
// }

export function NavigationMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <nav className="flex-center gap-2">
      <ProfileDropdown session={session} />
      <I18nLanguageSelect />
      <MenuButton setIsOpen={setIsOpen} />

      <Menu isOpen={isOpen} setIsOpen={setIsOpen} session={session} />
    </nav>
  );
}
function MenuButton({ setIsOpen }: { setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  function handleClick() {
    setIsOpen((prev) => {
      if (prev) {
        document.body.classList.remove('overflow-hidden');
        return false;
      } else {
        document.body.classList.add('overflow-hidden');
        return true;
      }
    });
  }
  return (
    <Button
      className="lg:hidden z-50 bg-foreground  has-[>svg]:px-1.5 has-[>svg]:py-1.5 h-auto  "
      onClick={handleClick}
    >
      <MenuIcon className="size-6" />
    </Button>
  );
}
