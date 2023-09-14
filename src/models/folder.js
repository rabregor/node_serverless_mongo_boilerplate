import dynamoose from "dynamoose";
import { dynamoConfig } from "utils/constants";

const folderSchema = new dynamoose.Schema({
  id: String,
  name: String,
  organization: String,
  requirements: {
    type: Array,
    schema: [String],
  },
});

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
