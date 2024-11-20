import { createWSHandler } from "@trpc/server/adapters/ws";
import { appRouter } from "@/lib/trpc";

export const handler = createWSHandler({
  router: appRouter,
  onConnect: () => {
    console.log("WebSocket connection established");
  },
  onDisconnect: () => {
    console.log("WebSocket connection closed");
  },
});

export default handler;
