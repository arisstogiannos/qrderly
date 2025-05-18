"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrdersContext } from "@/context/OrdersProvider";
import type { OrderWithItems } from "@/types";
import React, { useEffect, useState } from "react";
import { completeOrder } from "../../../_actions/orders";
import { useFormatter, useTranslations } from "next-intl";

export default function OrderDetails({
  withAction = false,
  selectedOrder,
}: {
  withAction?: boolean;
  selectedOrder?: OrderWithItems;
}) {
  const { currOrder, setCurrOrder, orders, setOrders } = useOrdersContext();
  const [order, setOrder] = useState(selectedOrder || currOrder);
  const formatter = useFormatter();
  const t = useTranslations("orderDetails");

  useEffect(() => {
    setOrder(currOrder);
  }, [currOrder]);

  useEffect(() => {
    if(!currOrder){

      if ( orders && orders.length > 0) {
        setCurrOrder(orders.at(0));
      } else {
        setCurrOrder(undefined);
      }
    }
  }, [orders]);

  if (!order) {
    return <div>{t("noOrderSelected")}</div>;
  }

  function handleComplete() {
    if (order) {
      setOrders((prev) => prev?.filter((o) => o.id !== order?.id));
      completeOrder(order.id);
    }
  }

  return (
    <section
      className={`${
        withAction ? "bg-accent/40 p-4 rounded-2xl" : ""
      } flex flex-col lg:flex-row justify-between gap-x-10   lg:max-h-[400px] `}
    >
      <div className="flex flex-col md:flex-row-reverse gap-20 grow justify-between">
        <div className="flex gap-20">
          <p>
            {t("table")}: {order.table}
          </p>
          <p>
            {t("time")}:{" "}
            {formatter.relativeTime(new Date(order.createdAt), Date.now())}
          </p>
        </div>
        <div className="overflow-x-auto overflow-y-auto max-h-[300px]">

        <ItemsTable order={order} />
        </div>
      </div>
      {withAction && (
        <div className="flex items-end justify-end">
          <Button onClick={handleComplete}>{t("complete")}</Button>
        </div>
      )}
    </section>
  );
}

function ItemsTable({ order }: { order: OrderWithItems }) {
  const t = useTranslations("orderDetails");

  return (
    <Table className="text-base  grow w-full  overflow-x-auto overflow-y-hidden mt-auto">
      <TableHeader className="text-lg">
        <TableRow className="lg:lg:hover:bg-transparent">
          <TableHead>{t("product")}</TableHead>
          <TableHead>{t("preferences")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-base  grow w-full  overflow-x-auto overflow-y-hidden">
        {order.orderItems.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.menuItem.name}</TableCell>
            <TableCell className="flex gap-5">
              {item.preferences !== "" &&
                item.preferences.split(", ").map((pr) => (
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
