import type { ReactNode } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import type { BusinessExtended, ExtendedUser } from '@/types';
import { TeamSwitcher } from './BusinessSwitcher';
import { NavFooter } from './NavFooter';
import { NavLinks } from './NavLinks';

export function AppSidebar({
  user,
  business,
  links,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: ExtendedUser;
  business: BusinessExtended;
  links: {
    title: string;
    url: string;
    icon: ReactNode;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon: ReactNode;
    }[];
  }[];
}) {
  const navLinks =
    business.product === 'QR_MENU' ? links.filter((item) => item.title !== 'Orders') : links;

  return (
    <Sidebar variant="inset" {...props} className="bg-primary rounded-3xl">
      <SidebarHeader>
        <TeamSwitcher
          businesses={user.business.filter((b) => b?.menu?.published)}
          business={business}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavLinks items={navLinks} activeBusinessName={business.name} />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter activeBusiness={business} user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
