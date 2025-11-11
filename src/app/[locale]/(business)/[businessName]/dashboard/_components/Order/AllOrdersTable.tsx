'use client';
import { MoreVertical } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import DisplayPrice from '@/components/DisplayPrice';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useBusinessContext } from '@/context/BusinessProvider';
import type { OrderWithItems } from '@/types';
import { deletOrder } from '../../../_actions/orders';
import DeleteModal from '../SharedComponents/DeleteModal';
import { Modal } from '../SharedComponents/Modal';
import OrderDetailsModal from './OrderDetailsModal';
// const OrdersTablePagination = dynamic(() => import("./OrdersTablePagination"));

export default function AllOrdersTable({ orders }: { orders: OrderWithItems[] }) {
  const { businessName } = useBusinessContext();
  const formater = useFormatter();
  const t = useTranslations('allOrdersTable');

  if (!orders || orders.length === 0) return <p>{t('noOrders')}</p>;

  async function handleDeleteOrder(item: string) {
    deletOrder(item, businessName).then(() => {});
  }

  return (
    <>
      <Table className="text-base">
        <TableHeader className="text-lg">
          <TableRow className="lg:lg:hover:bg-transparent">
            <TableHead>{t('products')}</TableHead>
            <TableHead>{t('price')}</TableHead>
            <TableHead className="max-sm:hidden">{t('date')}</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead className="text-center sr-only">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            let productNames = '';
            order.orderItems.forEach((item) => (productNames += `${item.menuItem.name}, `));
            return (
              <TableRow key={order.id}>
                <TableCell className="truncate max-w-32 sm:max-w-80">{productNames}</TableCell>
                <TableCell>
                  <DisplayPrice price={order.price} />
                </TableCell>
                <TableCell className="max-sm:hidden">
                  {formater.dateTime(new Date(order.createdAt), {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })}
                </TableCell>
                <TableCell>
                  <div
                    className={`rounded-lg lowercase first-letter:uppercase bg-green-600/30 p-1 text-center text-green-600 ${
                      order.status === 'PENDING' ? 'bg-yellow-600/30 text-yellow-600' : ''
                    }`}
                  >
                    {order.status}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="cursor-pointer">
                      <MoreVertical />
                      <span className="sr-only">{t('actions')}</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <Modal
                          trigger={
                            <Button variant={'ghost'} size={'sm'} className="w-full text-sm px-0">
                              {t('viewDetails')}
                            </Button>
                          }
                          title={t('orderDetails')}
                          subtitle=""
                          classNames="pt-5"
                        >
                          <OrderDetailsModal order={order} />
                        </Modal>
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" asChild>
                        <DeleteModal item={order.id} action={handleDeleteOrder} />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {/* <OrdersTablePagination /> */}
    </>
  );
}
