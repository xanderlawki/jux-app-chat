import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const expressApp = express();
  const server = createServer(expressApp);

  // WebSocket server
  const wss = new WebSocketServer({ server });

  console.log("here");

  const usersInRooms = {}; // Track users in chatrooms

  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      const { type, chatroomId, username } = JSON.parse(message);

      if (type === "join") {
        if (!usersInRooms[chatroomId]) usersInRooms[chatroomId] = [];
        usersInRooms[chatroomId].push(username);

        // Broadcast join notification
        wss.clients.forEach((client) => {
          if (client.readyState === ws.OPEN) {
            client.send(JSON.stringify({ type: "join", username, chatroomId }));
          }
        });
      } else if (type === "leave") {
        if (usersInRooms[chatroomId]) {
          usersInRooms[chatroomId] = usersInRooms[chatroomId].filter(
            (user) => user !== username
          );

          // Broadcast leave notification
          wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
              client.send(
                JSON.stringify({ type: "leave", username, chatroomId })
              );
            }
          });
        }
      }
    });
  });

  // Graceful error handling
  wss.on("error", (err) => {
    console.error("WebSocket server error:", err);
  });

  expressApp.all("*", (req, res) => handle(req, res));

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
