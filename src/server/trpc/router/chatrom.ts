import { createRouter } from "../context";
import { z } from "zod";

export const chatroomRouter = createRouter()
  // Subscription for new messages
  .subscription("onNewMessage", {
    input: z.object({
      chatroomId: z.string(),
    }),
    resolve({ ctx, input }) {
      return new Observable((emit) => {
        const onMessage = (message: any) => {
          if (message.chatroomId === input.chatroomId) {
            emit.next(message);
          }
        };

        ctx.eventEmitter.on("newMessage", onMessage);

        return () => {
          ctx.eventEmitter.off("newMessage", onMessage);
        };
      });
    },
  })

  // Mutation to send a message
  .mutation("sendMessage", {
    input: z.object({
      chatroomId: z.string(),
      content: z.string(),
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const message = {
        chatroomId: input.chatroomId,
        content: input.content,
        userId: input.userId,
        createdAt: new Date(),
      };

      // Broadcast the new message
      ctx.eventEmitter.emit("newMessage", message);

      return message;
    },
  });
