import { dynamoConfig } from "utils/constants";
import dynamoose from "dynamoose";

const userSchema = new dynamoose.Schema({
  id: String,
  name: String,
  lastName: String,
  email: String,
  type: {
    type: String,
    enum: ["client", "admin"],
  },
  isEnterprise: Boolean,
  organization: String,
});

const options = {
  create: true, // Create table in DB, if it does not exist,
  waitForActive: false, // Wait for table to be created,
  prefix: "email", // Custom prefix for table name
  suffix: "id", // Custom suffix for table name
};

export const User = dynamoose.model(
  dynamoConfig.tables.user,
  userSchema,
  options,
);
