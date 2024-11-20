import dbConnect from "@/lib/mongodb";
import Chatroom from "@/models/Chatroom";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await dbConnect();

  const { chatroomId, content, userId } = req.body;

  if (!chatroomId || !content || !userId) {
    return res
      .status(400)
      .json({ error: "Chatroom ID, content, and User ID are required" });
  }

  const chatroom = await Chatroom.findById(chatroomId);
  if (!chatroom) {
    return res.status(404).json({ error: "Chatroom not found" });
  }

  const message = { content, userId, createdAt: new Date() };
  chatroom.messages.push(message);
  await chatroom.save();

  return res.status(200).json(message);
}
