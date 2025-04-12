import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderWithItems } from "@/types";
import { useFormatter } from "next-intl";
import { useTranslations } from "next-intl";
import React from "react";

export default function OrderDetailsModal({
  order,
}: {
  order?: OrderWithItems;
}) {
  const t = useTranslations("orderDetailsModal");

  if (!order) {
    return <div>{t("noOrderSelected")}</div>;
  }
  const formatter = useFormatter();

  return (
    <section className={` flex justify-between gap-10 `}>
      <div className="flex flex-col gap-10 justify-between">
        <div className="flex gap-16">
          <p>
            {t("table")}: {order.table}
          </p>
          <p>
            {t("date")}:{" "}
            {formatter.dateTime(new Date(order.createdAt), {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        <ItemsTable order={order} />
      </div>
    </section>
  );
}

function ItemsTable({ order }: { order: OrderWithItems }) {
  const t = useTranslations("orderDetailsModal");

  return (
    <Table className="text-base  grow w-fit  overflow-x-visible overflow-y-hidden">
      <TableHeader className="text-lg">
        <TableRow className="lg:lg:hover:bg-transparent">
          <TableHead>{t("product")}</TableHead>
          <TableHead>{t("preferences")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {order.orderItems.map((item) => (
          <TableRow key={item.id}>
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
