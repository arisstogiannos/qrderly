'use client';
import { ChevronsUpDown, CreditCard, Eye, LogOut, Trash, TriangleAlert, User2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { signOutDashboard } from '@/app/[locale]/(auth)/_actions/login';
import I18nLanguageSelect from '@/components/I18nLanguageSelect';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Link as IntlLink } from '@/i18n/navigation';
import { encryptTable } from '@/lib/table-crypt';
import type { BusinessExtended, ExtendedUser } from '@/types';
import { deleteBusiness } from '../../_actions/deleteBusiness';
import UpgradeSubModal from '../SharedComponents/UpgradeSubModal';

export function NavFooter({
  user,
  activeBusiness,
}: {
  user: ExtendedUser;
  activeBusiness: BusinessExtended;
}) {
  const { isMobile } = useSidebar();
  const [adminEncryptedTableId, setAdminEncryptedTableId] = useState('');
  const [isDeletingBusiness, setIsDeletingBusiness] = useState(false);
  // const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const t = useTranslations('admin.navbar');

  useEffect(() => {
    async function encryptAdmin() {
      const decryptedTable = await encryptTable(`admin|${activeBusiness.name}`);
      if (decryptedTable) {
        setAdminEncryptedTableId(decryptedTable);
      }
    }
    encryptAdmin();
  }, [activeBusiness]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          asChild
        >
          <I18nLanguageSelect className=" bg-transparent border-background border-2" />
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          asChild
        >
          <Link
            href={`/${activeBusiness.name.replaceAll(' ', '-')}${activeBusiness.menu?.type === 'QR_MENU' ? '/menu' : '/smart-menu'}?table=${adminEncryptedTableId}`}
            target="_blank"
          >
            <span className="size-8 rounded-lg bg-foreground text-background flex-center">
              <Eye className="size-6" />
            </span>
            <span className="truncate">{t('Visit Live Menu')}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {user.image ? (
                <div className="size-8">
                  <Image
                    src={user.image}
                    alt="profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>
              ) : (
                <div className="size-8 rounded-lg bg-foreground text-background flex-center">
                  <User2 className="size-6" />
                </div>
              )}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-sm">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            {activeBusiness.subscription?.billing === 'FREETRIAL' ? (
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <UpgradeSubModal business={activeBusiness} />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuGroup>
            ) : null}

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  target="_blank"
                  href={`https://billing.stripe.com/p/login/14kbLiaQugGt4bm4gg?prefilled_email=${user.email}`}
                >
                  <CreditCard />
                  {t('Subscriptions')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <IntlLink href={'/user-settings'}>
                  <User2 />
                  {t('Settings')}
                </IntlLink>
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => setIsDeletingBusiness(true)}>
                <Trash />
                {`${t('delete')} ${activeBusiness.name}`}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOutDashboard}>
              <LogOut />
              {t('Logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <DeleteBusinessModal
        isOpen={isDeletingBusiness}
        setIsOpen={setIsDeletingBusiness}
        businessId={activeBusiness.id}
      />
    </SidebarMenu>
  );
}

function DeleteBusinessModal({
  isOpen,
  setIsOpen,
  businessId,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  businessId: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const t = useTranslations('admin.navbar');
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 ">
            <TriangleAlert className="size-5" /> {t('deleteBusiness')}
          </DialogTitle>
          <DialogDescription>{t('deleteBusinessDesc')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            autoFocus={false}
            disabled={isDeleting}
            onClick={() => {
              setIsDeleting(true);
              deleteBusiness(businessId);
            }}
          >
            {t('deleteBusiness')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
