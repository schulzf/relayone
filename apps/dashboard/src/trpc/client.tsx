"use client";
// ^-- to make sure we can mount the Provider from a server component
import {useAuth} from "@clerk/nextjs";
import SuperJSON from "@repo/superjson";
import type {QueryClient} from "@tanstack/react-query";
import {QueryClientProvider} from "@tanstack/react-query";
import {createTRPCClient, httpBatchLink, loggerLink} from "@trpc/client";
import {createTRPCContext} from "@trpc/tanstack-react-query";
import {TRPCRouter} from "api/src/Bundle/Trpc/TrpcRouter";
import {useState} from "react";
import {makeQueryClient} from "./query-client";

export const { TRPCProvider, useTRPC } = createTRPCContext<TRPCRouter>();

let browserQueryClient: QueryClient;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}

export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>
) {
  const { getToken } = useAuth();
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    createTRPCClient<TRPCRouter>({
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: process.env.NEXT_PUBLIC_API_URL!,
          transformer: SuperJSON,
          fetch: async (url, options) => {
            return fetch(url, {
              ...options,
              headers: {
                ...options?.headers,
                Authorization: `Bearer ${await getToken()}`,
              },
            });
          },
        }),
      ],
    })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
