import { model, Schema } from "mongoose";

const Service = new Schema(
  {
    step: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["month", "year"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, collection: "Service" },
);

export default model("Service", Service);
