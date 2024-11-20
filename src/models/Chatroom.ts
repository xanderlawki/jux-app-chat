import mongoose, { Schema, model, models } from "mongoose";

const ChatroomSchema = new Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.Chatroom || model("Chatroom", ChatroomSchema);
