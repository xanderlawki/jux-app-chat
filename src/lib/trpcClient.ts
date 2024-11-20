import { createWSClient, wsLink } from "@trpc/client/links/wsLink";
import { createTRPCProxyClient } from "@trpc/client";
import type { AppRouter } from "@/lib/trpc";

const wsClient = createWSClient({
  url: "ws://localhost:3000/api/trpc",
  onOpen: () => console.log("WebSocket connection established"),
  onClose: (code, reason) =>
    console.log(`WebSocket connection closed: ${code}, Reason: ${reason}`),
  onError: (err) => console.error("WebSocket error:", err),
});

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [wsLink({ client: wsClient })],
});
