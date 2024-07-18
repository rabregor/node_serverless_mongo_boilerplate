import { model, Schema } from "mongoose";

const User = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["client", "admin"],
      required: true,
    }
  },
  { timestamps: true, collection: "User" },
);

export default model("User", User);
