import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { authenticateJWT } from "../middlewares/auth.js";
import { getAllUsers, getUserById } from "./helpers/users/index.js";

// All Users middleware
const baseGetAllUsersHandler = async (event, context) => {
  return getAllUsers(event, context);
};

// Get User by ID middleware
const baseGetUserByIdHandler = async (event, context) => {
  return getUserById(event, context);
};

export const getAllUsersHandler = middy(baseGetAllUsersHandler)
  .use(httpJsonBodyParser())
  .before(authenticateJWT);

export const getUserByIdHandler = middy(baseGetUserByIdHandler)
  .use(httpJsonBodyParser())
  .before(authenticateJWT);
