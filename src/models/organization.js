import dynamoose from "dynamoose";
import { dynamoConfig } from "utils/constants";

const organizationSchema = new dynamoose.Schema({
  id: String,
  name: String,
});

const options = {
  create: true, // Create table in DB, if it does not exist,
  waitForActive: false, // Wait for table to be created,
  prefix: "id", // Custom prefix for table name
  suffix: "name", // Custom suffix for table name
};

export const Organization = dynamoose.model(
  dynamoConfig.tables.organization,
  organizationSchema,
  options,
);
