import dynamoose from "dynamoose";
import { dynamoConfig } from "../utils/constants.js";

const userSchema = new dynamoose.Schema(
  {
    email: String,
    name: String,
    lastName: String,
    password: String,
    type: {
      type: String,
      enum: ["client", "admin"],
    },
    isEnterprise: Boolean,
    organization: String,
  },
  {
    timestamps: {
      createdAt: ["createDate", "creation"],
      updatedAt: ["updateDate", "updated"],
    },
  },
);

export const User = dynamoose.model(dynamoConfig.tables.user, userSchema);
