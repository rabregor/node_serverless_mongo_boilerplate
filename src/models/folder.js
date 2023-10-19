import { model, Schema } from "mongoose";

const Folder = new Schema(
  {
    organization: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true, collection: "Folder" }
)

export default model("Folder", Folder);