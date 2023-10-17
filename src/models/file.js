import { model, Schema } from "mongoose";

const File = new Schema(
  {
    folder: {
      type: String,
      required: true,
    },  
    organization: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
  },
  { timestamps: true, collection: "File" }
)

export default model("File", File);
