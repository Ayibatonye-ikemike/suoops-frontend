"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRef, type ReactNode } from "react";

interface ReactQueryProviderProps {
  children: ReactNode;
}

// Provides a shared QueryClient instance across the app.
export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  // useRef to keep the same client instance for the lifetime of the component.
  const queryClientRef = useRef<QueryClient | null>(null);
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60_000, // 1 minute
          refetchOnWindowFocus: false,
          retry(failureCount, error) {
            // Never retry 4xx client errors (auth, validation, not-found, etc.)
            if (error instanceof Error && "status" in error) {
              const status = (error as Error & { status: number }).status;
              if (status >= 400 && status < 500) return false;
            }
            return failureCount < 2;
          },
        },
        mutations: {
          retry: false,
        },
      },
    });
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>{children}</QueryClientProvider>
  );
}

export default ReactQueryProvider;
