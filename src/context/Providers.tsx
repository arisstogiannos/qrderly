"use client"
import React, { ReactNode, useState } from 'react'
import { QueryClientProvider} from "@tanstack/react-query"
import { getQueryClient } from '../../react-query'


export default function Providers({children}:{children:ReactNode}) {
    // const [queryClient] = useState(  
    //   new QueryClient({
    
    //     defaultOptions: {
    //       queries: {
    //         refetchOnWindowFocus: false,
    //       },
    //     },
    //   })
    // )

    const queryClient = getQueryClient()
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
