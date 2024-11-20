import dbConnect from "@/lib/mongodb";
import Chatroom from "@/models/Chatroom";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await dbConnect();

  const chatrooms = await Chatroom.find({}, { messages: 0 });
  return res.status(200).json(chatrooms);
}
