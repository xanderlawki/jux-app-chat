import mongoose, { Schema, model, models } from "mongoose";

const ReactionSchema = new Schema({
  messageId: { type: Schema.Types.ObjectId, ref: "Message", required: true },
  type: { type: String, enum: ["like", "dislike"], required: true },
  username: { type: String, required: true },
});

const Reaction = models.Reaction || model("Reaction", ReactionSchema);

export default Reaction;
