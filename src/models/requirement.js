import dynamoose from "dynamoose";
import { dynamoConfig } from "../utils/constants.js";

const requirementSchema = new dynamoose.Schema({
  organization: {
    type: String,
    hashKey: true,
  },
  id: {
    type: String,
    rangeKey: true,
  },
  folder: {
    type: String,
    index: {
      global: true,
      name: "FolderIndex",
      project: true,
    },
  },
  requirement: String,
  status: {
    type: String,
    enum: ["created", "in_progress", "completed", "rejected"],
  },
  file: {
    type: String,
    required: false,
  },
});

const options = {
  create: true, // Create table in DB, if it does not exist,
  waitForActive: true,
};

export const Requirement = dynamoose.model(
  dynamoConfig.tables.requirement,
  requirementSchema,
  options,
);
