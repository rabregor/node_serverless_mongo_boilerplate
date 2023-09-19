import { createUUID } from "../../../utils/functions.js";
import responses from "../../../utils/responses.js";
import * as models from "../../../models/index.js";

export const getAllFiles = async (_, { user }) => {
  if (user.type === "admin") {
    const files = await models.File.scan().exec();
    if (!files.length) {
      return responses.success("files", []);
    }
    return responses.success("files", files);
  }

  const orgFiles = await models.File.query("organization")
    .using("OrganizationIndex")
    .eq(user.organization)
    .exec();
  if (!orgFiles.length) {
    return responses.success("files", []);
  }
  return responses.success("files", orgFiles);
};

export const getFileById = async (
  { pathParameters: { id, folder } },
  { user },
) => {
  const file = await models.File.get({ folder, id });

  if (!file) {
    return responses.notFound("File");
  }

  if (user.type !== "admin" && user.organization !== file.organization) {
    return responses.forbidden("You do not have access to this file");
  }

  return responses.success("file", file);
};

export const createFile = async ({ body }, { user }) => {
  const { name, type, folder, path } = body;

  if (!path) {
    return responses.badRequest("S3 path is required");
  }
  const [folderObj] = await models.Folder.scan("id").eq(folder).exec();

  if (!folderObj) {
    return responses.notFound("Folder");
  }

  if (user.type !== "admin" && user.organization !== folderObj.organization) {
    return responses.forbidden("You do not have access to this file");
  }

  const id = createUUID();
  const newFile = new models.File({
    id,
    name,
    type,
    folder,
    organization: folderObj.organization,
    path: path,
  });
  folderObj.updateDate = new Date().toISOString();

  try {
    await newFile.save();
    await folderObj.save();
    return responses.created("file", { file: newFile });
  } catch (error) {
    return responses.internalError(error);
  }
};

export const updateFile = async (
  { pathParameters: { id, folder }, body },
  { user },
) => {
  const fileToUpdate = await models.File.get({ folder, id });

  if (!fileToUpdate) {
    return responses.notFound("File");
  }

  if (
    user.type !== "admin" &&
    user.organization !== fileToUpdate.organization
  ) {
    return responses.forbidden("You do not have access to this file");
  }

  const updatableProperties = ["name", "type", "folder", "path"];

  updatableProperties.forEach((key) => {
    if (key in body) {
      fileToUpdate[key] = body[key];
    }
  });

  try {
    await fileToUpdate.save();
    return responses.success("file", fileToUpdate);
  } catch (error) {
    return responses.internalError(error);
  }
};
