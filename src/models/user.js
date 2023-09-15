import dynamoose from "dynamoose";
import { dynamoConfig } from "../utils/constants.js";

const userSchema = new dynamoose.Schema(
  {
    email: {
      type: String,
      hashKey: true,
    },
    name: String,
    lastName: String,
    password: String,
    type: {
      type: String,
      enum: ["client", "admin"],
    },
    isEnterprise: Boolean,
    organization: {
      type: String,
      index: {
        global: true,
        name: "OrganizationIndex",
        project: true,
      },
    },
  },
  {
    timestamps: {
      createdAt: ["createDate", "creation"],
      updatedAt: ["updateDate", "updated"],
    },
  },
);

const options = {
  create: true, // Create table in DB, if it does not exist,
  waitForActive: true, // Wait for table to be created,
};

export const User = dynamoose.model(
  dynamoConfig.tables.user,
  userSchema,
  options,
);
