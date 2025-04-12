"use client";
import React, { ReactNode, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "../../react-query";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: ReactNode }) {
  // const [queryClient] = useState(
  //   new QueryClient({

  //     defaultOptions: {
  //       queries: {
  //         refetchOnWindowFocus: false,
  //       },
  //     },
  //   })
  // )



  const queryClient = getQueryClient();
  return (
        <SessionProvider  >
    
    <QueryClientProvider client={queryClient}>
    {children}
    </QueryClientProvider>
    </SessionProvider>
  );
}
