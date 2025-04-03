"use client"
import React from "react";
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
import DeleteModal from "../DeleteModal";
import { deletOrder } from "../../../_actions/orders";
import { Modal } from "../Modal";
import { Button } from "@/components/ui/button";
import { OrderWithItems } from "@/types";
import OrderDetailsModal from "./OrderDetailsModal";
import { useBusinessContext } from "@/context/BusinessProvider";
// const OrdersTablePagination = dynamic(() => import("./OrdersTablePagination"));

export default function AllOrdersTable({
  orders,
}: {
  orders: OrderWithItems[];
}) {
  const {businessName} = useBusinessContext()
  if (!orders || orders.length === 0) return <p>No orders found</p>;

  async function handleDeleteOrder(item: string) {
    deletOrder(item,businessName).then(() => {});
   
  }

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
              <TableRow key={order.id}>
                <TableCell>{productNames}</TableCell>

                <TableCell>{formatCurrency(order.price / 100)}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleTimeString()} -{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
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
                          <OrderDetailsModal order={order} />
                        </Modal>
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" asChild>
                        <DeleteModal
                          item={order.id}
                          action={handleDeleteOrder}
                        />
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
