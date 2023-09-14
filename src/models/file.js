import dynamoose from "dynamoose";
import { dynamoConfig } from "utils/constants";

const fileSchema = new dynamoose.Schema({
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
});

const options = {
  create: true, // Create table in DB, if it does not exist,
  waitForActive: false, // Wait for table to be created,
  prefix: "id", // Custom prefix for table name
  suffix: "name", // Custom suffix for table name
};

export const File = dynamoose.model(
  dynamoConfig.tables.file,
  fileSchema,
  options,
);
