import { model, Schema } from "mongoose";

const Folder = new Schema(
  {
    organization: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["nomina", "mes"],
      required: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    month: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, collection: "Folder" },
);

export default model("Folder", Folder);
