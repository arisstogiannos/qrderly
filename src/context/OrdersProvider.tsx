"use client";

import { getPendingOrders } from "@/app/(business)/[businessName]/_actions/orders";
import { OrderWithItems } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type thisType = {
  orders: OrderWithItems[] ;
  currOrder: OrderWithItems | undefined ;
  setCurrOrder: (v: OrderWithItems | undefined) => void;
  isPending:boolean;
  setOrders:React.Dispatch<React.SetStateAction<OrderWithItems[] >>;
};

export const OrdersContext = createContext<thisType | undefined>(undefined);

export function OrdersProvider({
  children,
  businessName,
}: {
  children: ReactNode;
  businessName: string;
}) {
  const [currOrder, setCurrOrder] = useState<OrderWithItems>();
  const { data,isPending } = useQuery({
    queryFn: async () => {
      const p = getPendingOrders(businessName);
      return p;
    },
    queryKey: ["pending-orders"],
    refetchInterval: false,
    
  });
  const [orders, setOrders] = useState<OrderWithItems[]>(data ?? []);

  useEffect(() => {
    setOrders(data ?? []);
  }
  ,[data]);


  return (
    <OrdersContext.Provider value={{ orders, currOrder, setCurrOrder,isPending, setOrders }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrdersContext() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error("useOrdersContext outside provider");
  }

  return context;
}
