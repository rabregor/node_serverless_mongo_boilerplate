import dynamoose from "dynamoose";
import { dynamoConfig } from "../utils/constants.js";

const fileSchema = new dynamoose.Schema(
  {
    folder: {
      type: String,
      hashKey: true,
    },
    id: {
      type: String,
      rangeKey: true,
    },
    organization: {
      type: String,
      index: {
        global: true,
        name: "OrganizationIndex",
        project: true,
      },
    },
    name: String,
    path: String,
    type: String,
    createdAt: Date,
    updatedAt: Date,
    createdBy: String,
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
  create: true,
  waitForActive: true,
};

export const File = dynamoose.model(
  dynamoConfig.tables.file,
  fileSchema,
  options,
);
