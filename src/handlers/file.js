import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { authenticateJWT } from "../middlewares/auth.js";
import {
  getAllFiles,
  getFileById,
  createFile,
  updateFile,
} from "./helpers/file/index.js";

// Handlers y Middlewares para las operaciones de archivos

export const getAllFilesHandler = middy(async (event, context) => {
  return getAllFiles(event, context);
})
  .use(httpJsonBodyParser())
  .before(authenticateJWT);

export const getFileByIdHandler = middy(async (event, context) => {
  return getFileById(event, context);
})
  .use(httpJsonBodyParser())
  .before(authenticateJWT);

export const createFileHandler = middy(async (event, context) => {
  return createFile(event, context);
})
  .use(httpJsonBodyParser())
  .before(authenticateJWT);

export const updateFileHandler = middy(async (event, context) => {
  return updateFile(event, context);
})
  .use(httpJsonBodyParser())
  .before(authenticateJWT);
