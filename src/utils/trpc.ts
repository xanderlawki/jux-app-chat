import { createTRPCProxyClient, wsLink } from "@trpc/client";
import { createWSClient } from "@trpc/client/links/wsLink";
import type { AppRouter } from "@/server/trpc/router";

const wsClient = createWSClient({
  url: "ws://localhost:3001",
});

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    wsLink({
      client: wsClient,
    }),
  ],
});
