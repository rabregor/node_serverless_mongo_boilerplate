import dynamoose from "dynamoose";
import { dynamoConfig } from "../utils/constants.js";

const requirementSchema = new dynamoose.Schema({
  id: String,
  folder: String,
  requirement: String,
  status: {
    type: String,
    enum: ["created", "in_progress", "completed", "rejected"],
  },
  file: {
    type: String,
    required: false,
  },
  organization: String,
});

const options = {
  create: false, // Create table in DB, if it does not exist,
};

export const Requirement = dynamoose.model(
  dynamoConfig.tables.requirement,
  requirementSchema,
  options,
);
