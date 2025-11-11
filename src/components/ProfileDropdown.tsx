import { LayoutDashboard, LogOut, Settings, SquareMenu, Stars, User2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Session } from 'next-auth';
import { useTranslations } from 'next-intl';
import { signOut } from '@/app/[locale]/(auth)/_actions/login';
import { Link as IntlLink } from '@/i18n/navigation';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
export function ProfileDropdown({ session }: { session: Session | null }) {
  const businesses = session?.user.business.filter((b) => b.menu?.published);
  async function handle() {
    await signOut();
    location.reload();
  }

  const t = useTranslations('profileDropdown');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {session?.user.image ? (
          <Image
            src={session.user.image}
            alt="profile"
            width={40}
            height={40}
            className="rounded-full overflow-hidden cursor-pointer"
          />
        ) : (
          <div className="lg:bg-foreground lg:text-background text-foreground rounded-full p-2 cursor-pointer">
            <User2 size={'1.5rem'} />
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="pb-0">{t('account')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {session ? (
          <>
            <DropdownMenuItem asChild>
              <Link
                target="_blank"
                href={`https://billing.stripe.com/p/login/14kbLiaQugGt4bm4gg?prefilled_email=${session.user.email}`}
              >
                <Stars />
                {t('subscriptions')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <IntlLink href={'/user-settings'}>
                <Settings />
                {t('settings')}
              </IntlLink>
            </DropdownMenuItem>

            {businesses?.map((b) => (
              <DropdownMenuGroup key={b.name} className="mx-2">
                <DropdownMenuLabel className="flex items-center gap-2 text-nowrap ml-0 pl-0">
                  {b.name} <hr className="w-full" />
                </DropdownMenuLabel>

                <div key={b.name} className=" flex gap-2">
                  <DropdownMenuItem
                    className=" text-sm bg-foreground text-background transition-colors lg:hover:bg-primary"
                    asChild
                  >
                    <IntlLink
                      href={{
                        pathname: '/[businessName]/dashboard',
                        params: { businessName: b.name.replaceAll(' ', '-') },
                      }}
                    >
                      <LayoutDashboard /> {t('dashboard')}
                    </IntlLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className=" text-sm bg-foreground text-background transition-colors lg:hover:bg-primary"
                    asChild
                  >
                    <IntlLink
                      target="_blank"
                      href={{
                        pathname: `/[businessName]/${b.menu?.type === 'QR_MENU' ? 'menu' : 'smart-menu'}`,
                        search: b.menu?.type !== 'QR_MENU' ? '?table=admin' : '',
                        params: { businessName: b.name.replaceAll(' ', '-') },
                      }}
                    >
                      <SquareMenu /> {t('menu')}
                    </IntlLink>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuGroup>
            ))}
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild className="">
              <form action={handle}>
                <Button className=" w-full" type="submit">
                  <LogOut className="rotate-180 text-background" />
                  {t('signOut')}
                </Button>
              </form>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem>
            <Link href="/sign-up">{t('signIn')}</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
