import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/environment.js";
import responses from "../utils/responses.js";

export const authenticateJWT = async (request) => {
  const { headers } = request.event;
  const token = headers.Authorization || headers.authorization;

  if (!token) {
    return responses.unauthorized("No token provided.");
  }
  const [, receivedToken] = token.split(" ");
  try {
    const user = jwt.verify(receivedToken, SECRET_KEY);
    request.context.user = user;
  } catch (error) {
    return responses.internalError(error);
  }
};
