"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import OrderDetails from "./OrderDetails";
import { useOrdersContext } from "@/context/OrdersProvider";
import Loader from "@/components/Loader";
import { Modal } from "../Modal";
import DeleteModal from "../DeleteModal";
import { deletOrder } from "../../../_actions/orders";
// const OrdersTablePagination = dynamic(() => import("./OrdersTablePagination"));

export default function OrdersTable() {
  const { orders, setCurrOrder, currOrder,isPending } = useOrdersContext();
  const [previousOrders, setPreviousOrders] = useState(() => orders);

//  useEffect(() => {
//   if (previousOrders?.length !== orders?.length) {
//     setPreviousOrders(orders);

//     const playAudio = async () => {
//       try {
//         const audio = new Audio("/new-order-audio.mp3"); // Ensure the file exists in public/
//         await audio.play(); // Handle promise rejection properly
//       } catch (error) {
//         console.error("Audio playback failed:", error);
//       }
//     };

//     playAudio(); // Call the async function
//   }
// }, [orders]);

  if (isPending) return <Loader className="w-20 mx-auto"/>;
  if (!orders || orders.length === 0) return <p>No orders found</p>;

  return (
    <>
      <Table className="text-base">
        <TableHeader className="text-lg">
          <TableRow className="lg:lg:hover:bg-transparent">
            <TableHead>Products</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            let productNames = "";
            order.orderItems.forEach(
              (item) => (productNames += item.menuItem.name + ", ")
            );
            return (
              <TableRow
                key={order.id}
                onClick={() => setCurrOrder(order)}
                className={(currOrder && currOrder.id === order.id)?"bg-accent pointer-events-none":"cursor-pointer lg:hover:bg-secondary"}
              >
                <TableCell>{productNames}</TableCell>

                <TableCell>{formatCurrency(order.price / 100)}</TableCell>
                <TableCell>
                  {order.createdAt.toLocaleTimeString() +
                    " - " +
                    order.createdAt.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div
                    className={`rounded-lg lowercase first-letter:uppercase bg-green-600/30 p-1 text-center text-green-600 ${order.status === "PENDING" ? "bg-yellow-600/30 text-yellow-600" : ""}`}
                  >
                    {order.status}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="cursor-pointer">
                      <MoreVertical />
                      <span className="sr-only">Actions</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <Modal
                          trigger={
                            <Button
                              variant={"ghost"}
                              size={"sm"}
                              className="w-full text-sm px-0"
                            >
                              View Details{" "}
                            </Button>
                          }
                          title="Order Details"
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
