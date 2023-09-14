import { createUUID } from "../../../utils/functions.js";
import {
  getItem,
  putItem,
  getAllItems,
  updateItem,
} from "../../../utils/dynamoHandler.js";

export const getAllFiles = async (_, { user }) => {
  if (user.type !== "admin") {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "Forbidden" }),
    };
  }
  const files = await getAllItems("Files");

  return {
    statusCode: 200,
    body: JSON.stringify(files),
  };
};

export const getFileById = async (event) => {
  const fileId = event.pathParameters.id;
  const file = await getItem("Files", { id: fileId });

  if (!file) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "File not found" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(file),
  };
};

export const createFile = async (event) => {
  const { name, type, organization, folder } = JSON.parse(event.body);
  const fileId = createUUID();

  const success = await putItem("Files", {
    id: fileId,
    name,
    type,
    organization,
    folder,
  });

  return success
    ? {
        statusCode: 201,
        body: JSON.stringify({ id: fileId }),
      }
    : {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to create file" }),
      };
};

export const updateFile = async (event) => {
  const fileId = event.pathParameters.id;
  const { name, type, organization, folder } = JSON.parse(event.body);

  const updateExpression =
    "SET #n = :name, #t = :type, #o = :organization, #f = :folder";
  const expressionAttributeValues = {
    ":name": name,
    ":type": type,
    ":organization": organization,
    ":folder": folder,
  };
  const expressionAttributeNames = {
    "#n": "name",
    "#t": "type",
    "#o": "organization",
    "#f": "folder",
  };

  const updatedFile = await updateItem(
    "Files",
    { id: fileId },
    updateExpression,
    expressionAttributeValues,
    expressionAttributeNames,
  );

  if (!updatedFile) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to update file" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedFile),
  };
};
