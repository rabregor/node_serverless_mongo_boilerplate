import { createUUID } from "../../../utils/functions.js";
import {
  getItem,
  putItem,
  getAllItems,
  updateItem,
} from "../../../utils/dynamoHandler.js";

export const getAllFolders = async (event, { user }) => {
  const files = await getAllItems("Folders");

  return {
    statusCode: 200,
    body: JSON.stringify(files),
  };
};

export const getFolderById = async (event, { user }) => {
  const folderId = event.pathParameters.id;
  const folder = await getItem("Folders", { id: folderId });

  if (!folder) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Folder not found" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(folder),
  };
};

export const createFolder = async (event, { user }) => {
  const { name, organization } = JSON.parse(event.body);
  const folderId = createUUID();

  const success = await putItem("Folders", {
    id: folderId,
    name,
    organization,
  });

  return success
    ? {
        statusCode: 201,
        body: JSON.stringify({ id: folderId }),
      }
    : {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to create folder" }),
      };
};

export const updateFolder = async (event, { user }) => {
  const folderId = event.pathParameters.id;
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
    "Folders",
    { id: folderId },
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
