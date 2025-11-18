'use client';
import { MoreVertical } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import DisplayPrice from '@/components/DisplayPrice';
import Loader from '@/components/Loader';
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
import { useOrdersContext } from '@/context/OrdersProvider';
import type { OrderWithItems } from '@/types';
import { deletOrder } from '../../../_actions/orders';
import DeleteModal from '../SharedComponents/DeleteModal';
import { Modal } from '../SharedComponents/Modal';
import OrderDetails from './OrderDetails';

export default function OrdersTable() {
  const { orders, setCurrOrder, currOrder, isPending } = useOrdersContext();
  const [previousOrders, setPreviousOrders] = useState<OrderWithItems[]>();
  const isFirstRender = useRef(true);
  const formater = useFormatter();
  const t = useTranslations('ordersTable');

  useEffect(() => {
    if (previousOrders?.length !== orders?.length) {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      const playAudio = async () => {
        try {
          const audio = new Audio('/new-order-audio.mp3');
          await audio.play();
        } catch (error) {
          console.error('Audio playback failed:', error);
        }
      };

      playAudio();
    }
    setPreviousOrders(orders);
  }, [orders]);

  if (isPending) return <Loader className="w-20 mx-auto" />;
  if (!orders || orders.length === 0) return <p>{t('noOrders')}</p>;

  return (
    <>
      <Table className="text-base ">
        <TableHeader className="text-lg">
          <TableRow className="lg:lg:hover:bg-transparent">
            <TableHead>{t('products')}</TableHead>
            <TableHead>{t('price')}</TableHead>
            <TableHead className="max-sm:hidden">{t('date')}</TableHead>
            <TableHead className="text-center sr-only">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            let productNames = '';
            for (const item of order.orderItems) {
              productNames += `${item.menuItem.name}, `;
            }
            return (
              <TableRow
                key={order.id}
                onClick={() => setCurrOrder(order)}
                className={
                  currOrder && currOrder.id === order.id
                    ? 'bg-accent '
                    : 'cursor-pointer lg:hover:bg-secondary'
                }
              >
                <TableCell className="max-w-[200px] sm:max-w-[300px] truncate">
                  {productNames.slice(0, -2)}
                </TableCell>

                <TableCell>
                  <DisplayPrice price={order.price} />
                </TableCell>
                <TableCell className="max-sm:hidden">
                  {formater.dateTime(new Date(order.createdAt), {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })}
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
                          <OrderDetails selectedOrder={order} />
                        </Modal>
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" asChild>
                        <DeleteModal item={order.id} action={deletOrder} />
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
