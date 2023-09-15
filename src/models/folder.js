import dynamoose from "dynamoose";
import { dynamoConfig } from "../utils/constants.js";

const folderSchema = new dynamoose.Schema(
  {
    organization: {
      type: String,
      hashKey: true,
    },
    id: {
      type: String,
      rangeKey: true,
    },
    name: String,
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

export const Folder = dynamoose.model(
  dynamoConfig.tables.folder,
  folderSchema,
  options,
);
