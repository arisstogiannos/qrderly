import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderWithItems } from "@/types";
import React from "react";

export default function OrderDetailsModal({
  order,
}: {
  order?: OrderWithItems;
}) {
 


  if (!order) {
    return <div>No order selected</div>;
  }


  return (
    <section
      className={` flex justify-between gap-10 `}
    >
      <div className="flex flex-col gap-10 justify-between">
        <div className="flex gap-20">
          <p>Table: {order.table}</p>
          <p>Time: {order.createdAt.toLocaleTimeString()}</p>
        </div>
        {/* <div className="flex gap-20 md:hidden">
          <p>Price: {order.price}</p>
          <p>Time: {order.status}</p>
        </div> */}

        <ItemsTable order={order} />
      </div>
      
    </section>
  );
}

function ItemsTable({ order }: { order: OrderWithItems }) {
  return (
    <Table className="text-base  grow w-fit  overflow-x-visible overflow-y-hidden">
      <TableHeader className="text-lg">
        <TableRow className="lg:lg:hover:bg-transparent">
          <TableHead>Product</TableHead>
          <TableHead>Preferances</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody >
        {order.orderItems.map((item) => (
          <TableRow  key={item.id}>
            <TableCell>{item.menuItem.name}</TableCell>
            <TableCell className="flex gap-5">
              {item.preferences.split(", ").map((pr) => (
                <span key={pr} className="p-2 bg-secondary rounded-lg">
                  {pr}
                </span>
              ))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
