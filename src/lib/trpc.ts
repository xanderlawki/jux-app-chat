import { initTRPC } from "@trpc/server";
import { z } from "zod";
import User from "@/models/User";
import Chatroom from "@/models/Chatroom";
import Message from "@/models/Message";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import dbConnect from "./mongodb";

const t = initTRPC.create();
const ee = new EventEmitter();
const usersInRooms: Record<string, string[]> = {};
export const appRouter = t.router({
  // Fetch all chatrooms
  getMessages: t.procedure
    .input(z.object({ chatroomId: z.string() })) // Input validation
    .query(async ({ input }) => {
      await dbConnect(); // Connect to the database
      return Chatroom.find().sort("createdAt"); // Fetch messages
    }),

  getChatrooms: t.procedure.query(async () => {
    await dbConnect();
    const chatrooms = await Chatroom.find();
    console.log("Chatrooms fetched:", chatrooms);
    return chatrooms;
  }),
  // Fetch messages for a chatroom

  // Subscribe to real-time messages
  messages: t.procedure
    .input(z.object({ chatroomId: z.string() }))
    .subscription(({ input }) => {
      return observable((emit) => {
        const listener = (message: any) => {
          if (message.chatroomId === input.chatroomId) {
            emit.next(message);
          }
        };

        ee.on("new-message", listener);

        return () => {
          ee.off("new-message", listener);
        };
      });
    }),

  getActiveUsers: t.procedure
    .input(z.object({ chatroomId: z.string() }))
    .query(({ input }) => {
      return usersInRooms[input.chatroomId] || [];
    }),

  signIn: t.procedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ input }) => {
      await dbConnect(); // Ensure database connection

      // Check if the user already exists
      let user = await User.findOne({ username: input.username });

      // If the user doesn't exist, create a new one
      if (!user) {
        user = await User.create({ username: input.username });
      }

      return { id: user._id, username: user.username }; // Return user info
    }),
  // Add a message to a chatroom
  sendMessage: t.procedure
    .input(
      z.object({
        chatroomId: z.string(),
        username: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await dbConnect();
      const message = await Message.create(input);
      ee.emit("new-message", message);
      return message;
    }),
});

export type AppRouter = typeof appRouter;
