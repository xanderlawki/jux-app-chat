import mongoose, { Schema, model, models } from "mongoose";

const MessageSchema = new Schema({
  chatroomId: { type: Schema.Types.ObjectId, ref: "Chatroom", required: true },
  username: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.Message || model("Message", MessageSchema);
