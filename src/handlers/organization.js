import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { authenticateJWT } from "../middlewares/auth.js";
import { createOrganization as generateOrganization } from "./helpers/organization/index.js";

// All Users middleware
const createOrganization = async (event, context) => {
  return generateOrganization(event, context);
};

export const createOrganizationHandler = middy(createOrganization)
  .use(httpJsonBodyParser())
  .before(authenticateJWT);
