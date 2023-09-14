import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { authenticateJWT } from "../middlewares/auth.js";
import {
  getAllFolders,
  getFolderById,
  createFolder,
  updateFolder,
} from "./helpers/folder/index.js";

// Handlers y Middlewares para las operaciones de carpetas

export const getAllFoldersHandler = middy(async (event, context) => {
  return getAllFolders(event, context);
})
  .use(httpJsonBodyParser())
  .before(authenticateJWT);

export const getFolderByIdHandler = middy(async (event, context) => {
  return getFolderById(event, context);
})
  .use(httpJsonBodyParser())
  .before(authenticateJWT);

export const createFolderHandler = middy(async (event, context) => {
  return createFolder(event, context);
})
  .use(httpJsonBodyParser())
  .before(authenticateJWT);

export const updateFolderHandler = middy(async (event, context) => {
  return updateFolder(event, context);
})
  .use(httpJsonBodyParser())
  .before(authenticateJWT);
