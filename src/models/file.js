import { model, Schema } from "mongoose";

const File = new Schema(
  {
    folder: { type: Schema.Types.ObjectId, ref: "Folder", required: true },
    organization: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "File" }
)

export default model("File", File);
