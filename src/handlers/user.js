import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { authenticateJWT } from "../middlewares/auth.js";
import {
  getAllUsers,
  getUserById,
  getUserByToken,
  updateUser,
} from "./helpers/users/index.js";

// All Users middleware
const baseGetAllUsersHandler = async (event, context) => {
  return getAllUsers(event, context);
};

// Get User by ID middleware
const baseGetUserByIdHandler = async (event, context) => {
  return getUserById(event, context);
};

const baseGetUserByContextHandler = async (event, context) => {
  return getUserByToken(event, context);
};

export const getAllUsersHandler = middy(baseGetAllUsersHandler)
  .use(httpJsonBodyParser())
  .before(authenticateJWT);

export const getUserByIdHandler = middy(baseGetUserByIdHandler)
  .use(httpJsonBodyParser())
  .before(authenticateJWT);

export const getUserByTokenHandler = middy(baseGetUserByContextHandler)
  .use(httpJsonBodyParser())
  .before(authenticateJWT);

export const updateUserHandler = middy(async (event, context) => {
  return updateUser(event, context);
})
  .use(httpJsonBodyParser())
  .before(authenticateJWT);
