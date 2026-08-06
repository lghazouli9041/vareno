"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { WishlistSync } from "@/components/wishlist/WishlistSync";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Client-side providers boundary.
 */
export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <WishlistSync />
        {children}
      </QueryClientProvider>
    </ClerkProvider>
  );
}