import dynamoose from "dynamoose";
import { dynamoConfig } from "../utils/constants.js";

const folderSchema = new dynamoose.Schema(
  {
    id: String,
    name: String,
    organization: String,
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
  prefix: "id", // Custom prefix for table name
};

export const Folder = dynamoose.model(
  dynamoConfig.tables.folder,
  folderSchema,
  options,
);
