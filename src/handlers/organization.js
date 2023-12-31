import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { authenticateJWT } from "../middlewares/auth.js";
import {
  createOrganization as generateOrganization,
  createOrganizationAndUser,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
} from "./helpers/organization/index.js";

// All Users middleware
const createOrganization = async (event, context) => {
  return generateOrganization(event, context);
};

const getOrganizations = async (event, context) => {
  return getAllOrganizations(event, context);
};

const getOrganization = async (event, context) => {
  return getOrganizationById(event, context);
};

export const createOrganizationHandler = middy(createOrganization)
  .use(httpJsonBodyParser())
  .before(authenticateJWT);

export const createOrganizationAndUserHandler = middy(
  createOrganizationAndUser,
).use(httpJsonBodyParser());

export const getOrganizationsHandler = middy(getOrganizations)
  .use(httpJsonBodyParser())
  .before(authenticateJWT);

export const getOrganizationHandler = middy(getOrganization)
  .use(httpJsonBodyParser())
  .before(authenticateJWT);

export const updateOrganizationHandler = middy(async (event, context) => {
  return updateOrganization(event, context);
})
  .use(httpJsonBodyParser())
  .before(authenticateJWT);
