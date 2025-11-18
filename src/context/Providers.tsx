'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { type ReactNode } from 'react';
import { getQueryClient } from '../../react-query';

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
    <SessionProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}
