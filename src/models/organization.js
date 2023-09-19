import dynamoose from "dynamoose";
import { dynamoConfig } from "../utils/constants.js";

const organizationSchema = new dynamoose.Schema(
  {
    id: String,
    name: String,
    rfc: String,
  },
  {
    timestamps: true,
  },
);

const options = {
  create: true, // Create table in DB, if it does not exist,
  waitForActive: true, // Wait for table to be created,
};

export const Organization = dynamoose.model(
  dynamoConfig.tables.organization,
  organizationSchema,
  options,
);
