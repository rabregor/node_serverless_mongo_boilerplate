import { createUUID } from "../../../utils/functions.js";
import responses from "../../../utils/responses.js";
import * as models from "../../../models/index.js";

export const getAllFolders = async (_, { user }) => {
  if (user.type !== "admin") {
    return responses.forbidden;
  }
  const folders = await models.Folder.scan().exec();
  return responses.success("folders", folders);
};

export const getFolderById = async (event) => {
  const folderId = event.pathParameters.id;
  const folder = await models.Folder.get(folderId);

  if (!folder) {
    return responses.notFound("Folder");
  }

  return responses.success("folder", folder);
};

export const createFolder = async ({ body }) => {
  const { name, organization, requirements } = body;
  const folderId = createUUID();

  const newFolder = new models.Folder({
    id: folderId,
    name,
    organization,
  });

  const success = await newFolder.save();

  if (requirements && Array.isArray(requirements)) {
    for (const req of requirements) {
      const requirementId = createUUID();
      const newRequirement = new models.Requirement({
        id: requirementId,
        folder: folderId,
        ...req,
        organization,
      });
      await newRequirement.save();
    }
  }

  return success
    ? responses.created("folder", { folder: { ...newFolder, requirements } })
    : responses.internalError("Failed to create folder");
};

export const updateFolder = async ({
  pathParameters: { id: folderId },
  body,
}) => {
  if (!folderId) {
    return responses.badRequest;
  }
  const { name, organization } = body;

  const folderToUpdate = await models.Folder.get(folderId);

  if (!folderToUpdate) {
    return responses.notFound("Folder");
  }

  folderToUpdate.name = name;
  folderToUpdate.organization = organization;

  const updatedFolder = await folderToUpdate.save();

  return updatedFolder
    ? responses.success("folder", updatedFolder)
    : responses.internalError("Failed to update folder");
};
