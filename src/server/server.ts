import { WebSocketServer } from "ws";
import { createWSSHandler } from "@trpc/server/adapters/ws";
import { router } from "./trpc/router";
import { createContext } from "./trpc/context";

const wss = new WebSocketServer({ port: 3001 });

const handler = createWSSHandler({
  router,
  createContext,
});

wss.on("connection", (ws) => {
  handler(ws);
});

console.log("WebSocket server running on ws://localhost:3001");
