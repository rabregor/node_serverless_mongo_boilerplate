import { model, Schema } from "mongoose";

const Requirement = new Schema(
  {
    organization: {
      type: String,
      required: true,
    },
    folder: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
    },
    requirement: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["created", "in_progress", "completed", "rejected"],
    },
    file: {
      type: Schema.Types.ObjectId,
      ref: "File",
      required: false,
      default: null,
    },
  },
  { timestamps: true, collection: "Requirement" },
);

export default model("Requirement", Requirement);
