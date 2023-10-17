import responses from "../../../utils/responses.js";
import * as models from "../../../models/index.js";
import { Types } from "mongoose";

export const getAllFiles = async (_, { user }) => {
  if (user.type === "admin") {
    // const files = await models.File.scan().exec();
    const files = await models.File.find({});
    if (!files.length) {
      return responses.success("files", []);
    }
    return responses.success("files", files);
  }

  /*
  const orgFiles = await models.File.query("organization")
    .using("OrganizationIndex")
    .eq(user.organization)
    .exec();
  */
  const orgFiles = await models.File.find({ organization: Types.ObjectId(user.organization)});

  if (!orgFiles.length) {
    return responses.success("files", []);
  }
  return responses.success("files", orgFiles);
};

export const getFileById = async (
  { pathParameters: { id, folder } },
  { user },
) => {

  //const file = await models.File.get({ folder, id });
  const file = await models.File.findOne({
    _id: new Types.ObjectId(id),
    folder: new Types.ObjectId(folder),
  });

  if (!file) {
    return responses.notFound("File");
  }

  if (user.type !== "admin" && user.organization !== file.organization) {
    return responses.forbidden("You do not have access to this file");
  }

  return responses.success("file", file);
};

export const createFile = async ({ body }, { user }) => {
  const { name, type, folder, path, service } = body;

  if (!path) {
    return responses.badRequest("S3 path is required");
  }
  // const [folderObj] = await models.Folder.scan("id").eq(folder).exec();
  const folderObj = await models.Folder.findById(new Types.ObjectId(folder));

  if (!folderObj) {
    return responses.notFound("Folder");
  }

  if (user.type !== "admin" && user.organization !== folderObj.organization) {
    return responses.forbidden("You do not have access to this file");
  }

  const newFile = new models.File({ 
    name,
    type,
    folder,
    organization: String(folderObj.organization),
    path,
    createdBy: user._id,
    service,
  });


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
  // const fileToUpdate = await models.File.get({ folder, id });
  const fileToUpdate = await models.File.findOne({
    _id: new Types.ObjectId(id),
    folder: new Types.ObjectId(folder),
  });

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
