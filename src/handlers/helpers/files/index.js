import { createUUID } from "../../../utils/functions.js";
import responses from "../../../utils/responses.js";
import * as models from "../../../models/index.js";

export const getAllFiles = async (_, { user }) => {
  if (user.type !== "admin") {
    return responses.forbidden;
  }

  const files = await models.File.scan().exec();

  return responses.success("files", files);
};

export const getFileById = async (event, { user }) => {
  const fileId = event.pathParameters.id;
  const file = await models.File.get(fileId);

  if (!file) {
    return responses.notFound("File");
  }

  if (user.type !== "admin" && user.organization !== file.organization) {
    return responses.forbidden;
  }

  return {
    statusCode: 200,
    body: JSON.stringify(file),
  };
};

export const createFile = async ({ body }) => {
  const { name, type, organization, folder } = body;
  const fileId = createUUID();

  const newFile = new models.File({
    id: fileId,
    name,
    type,
    organization,
    folder,
  });

  const success = await newFile.save();

  return success
    ? responses.created("file", { file: newFile })
    : responses.internalError("Failed to create file");
};

export const updateFile = async (event) => {
  const fileId = event.pathParameters.id;
  const { name, type, organization, folder } = event.body;

  const fileToUpdate = await models.File.get(fileId);

  if (!fileToUpdate) {
    return responses.notFound("File");
  }

  fileToUpdate.name = name;
  fileToUpdate.type = type;
  fileToUpdate.organization = organization;
  fileToUpdate.folder = folder;

  const updatedFile = await fileToUpdate.save();

  return updatedFile
    ? responses.success("file", updatedFile)
    : responses.internalError("Failed to update file");
};
