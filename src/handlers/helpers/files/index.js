import { createUUID } from "../../../utils/functions.js";
import responses from "../../../utils/responses.js";
import * as models from "../../../models/index.js";

export const getAllFiles = async (_, { user }) => {
  if (user.type === "admin") {
    const files = await models.File.scan().exec();
    return responses.success("files", files);
  }

  const orgFiles = await models.File.query("organization")
    .using("OrganizationIndex")
    .eq(user.organization)
    .exec();
  return responses.success("files", orgFiles);
};

export const getFileById = async (
  { pathParameters: { id, organization } },
  { user },
) => {
  const file = await models.File.get({ folder: organization, id });

  if (!file) {
    return responses.notFound("File");
  }

  if (user.type !== "admin" && user.organization !== file.organization) {
    return responses.forbidden("You do not have access to this file");
  }

  return responses.success("file", file);
};

export const createFile = async ({ body }, { user }) => {
  const { name, type, folder } = body;

  if (user.type !== "admin" && user.organization !== folder) {
    return responses.forbidden("You do not have access to this file");
  }

  const id = createUUID();

  const newFile = new models.File({
    id,
    name,
    type,
    folder,
    organization: user.organization, // assuming the organization is available in the user object
  });

  try {
    await newFile.save();
    return responses.created("file", { file: newFile });
  } catch (error) {
    return responses.internalError(error);
  }
};

export const updateFile = async (
  { pathParameters: { id, organization }, body },
  { user },
) => {
  const fileToUpdate = await models.File.get({ folder: organization, id });

  if (!fileToUpdate) {
    return responses.notFound("File");
  }

  if (
    user.type !== "admin" &&
    user.organization !== fileToUpdate.organization
  ) {
    return responses.forbidden("You do not have access to this file");
  }

  const { name, type, folder } = body;

  fileToUpdate.name = name;
  fileToUpdate.type = type;
  fileToUpdate.folder = folder; // You might want to be cautious while updating the folder

  try {
    await fileToUpdate.save();
    return responses.success("file", fileToUpdate);
  } catch (error) {
    return responses.internalError(error);
  }
};
