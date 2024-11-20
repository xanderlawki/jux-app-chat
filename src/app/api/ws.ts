import { createWSSHandler } from "@trpc/server/adapters/ws";
import { router } from "@/server/trpc/router";
import { createContext } from "@/server/trpc/context";
import { NextApiRequest, NextApiResponse } from "next";
import { WebSocketServer } from "ws";

let wss: WebSocketServer | null = null;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!wss) {
    wss = new WebSocketServer({ noServer: true });

    const handler = createWSSHandler({
      router,
      createContext,
    });

    wss.on("connection", (ws) => handler(ws));

    req.socket.server.on("upgrade", (request, socket, head) => {
      if (request.url === "/api/ws") {
        wss?.handleUpgrade(request, socket, head, (client) => {
          wss?.emit("connection", client, request);
        });
      }
    });

    console.log("WebSocket server initialized");
  }

  res.status(200).end();
}
