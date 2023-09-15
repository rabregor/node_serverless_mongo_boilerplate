import dynamoose from "dynamoose";
import { dynamoConfig } from "../utils/constants.js";

const fileSchema = new dynamoose.Schema(
  {
    id: String,
    name: String,
    path: String,
    type: String,
    createdAt: Date,
    updatedAt: Date,
    createdBy: String,
    organization: String,
    folder: {
      type: String,
      required: false,
    },
    deleted: Boolean,
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
  waitForActive: false, // Wait for table to be created,
};

export const File = dynamoose.model(
  dynamoConfig.tables.file,
  fileSchema,
  options,
);
