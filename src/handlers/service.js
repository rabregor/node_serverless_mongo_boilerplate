import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { authenticateJWT } from "../middlewares/auth.js";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
} from "./helpers/service/index.js";

export const getAllServicesHandler = middy(async (event, context) => {
  return getAllServices(event, context);
})
  .use(httpJsonBodyParser())
  .before(authenticateJWT);

export const getServiceByIdHandler = middy(async (event, context) => {
  return getServiceById(event, context);
})
  .use(httpJsonBodyParser())
  .before(authenticateJWT);

export const createServiceHandler = middy(async (event, context) => {
  return createService(event, context);
})
  .use(httpJsonBodyParser())
  .before(authenticateJWT);

export const updateServiceHandler = middy(async (event, context) => {
  return updateService(event, context);
})
  .use(httpJsonBodyParser())
  .before(authenticateJWT);
