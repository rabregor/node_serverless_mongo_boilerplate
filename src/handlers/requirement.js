import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { authenticateJWT } from "../middlewares/auth.js";
import {
  getAllRequirements,
  getRequirementById,
  createRequirement,
  updateRequirement,
} from "./helpers/requirement/index.js"; // Make sure you import from the correct location

export const getAllRequirementsHandler = middy(async (event, context) => {
  return getAllRequirements(event, context);
})
  .use(httpJsonBodyParser())
  .before(authenticateJWT);

export const getRequirementByIdHandler = middy(async (event, context) => {
  return getRequirementById(event, context);
})
  .use(httpJsonBodyParser())
  .before(authenticateJWT);

export const createRequirementHandler = middy(async (event, context) => {
  return createRequirement(event, context);
})
  .use(httpJsonBodyParser())
  .before(authenticateJWT);

export const updateRequirementHandler = middy(async (event, context) => {
  return updateRequirement(event, context);
})
  .use(httpJsonBodyParser())
  .before(authenticateJWT);
