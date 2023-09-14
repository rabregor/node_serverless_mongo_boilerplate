import {
  registerUser,
  authenticateUser,
} from "./helpers/authentication/index.js";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { authenticateJWT } from "../middlewares/auth.js";

// Register middleware
const baseRegisterHandler = async (event, context) => {
  return registerUser(event, context);
};

// Auth middleware
const baseAuthHandler = async (event, context) => {
  return authenticateUser(event, context);
};

const registerHandler = middy(baseRegisterHandler)
  .use(httpJsonBodyParser())
  .before(authenticateJWT);

const authHandler = middy(baseAuthHandler).use(httpJsonBodyParser());

export { registerHandler, authHandler };
