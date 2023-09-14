import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/environment.js";

export const authenticateJWT = async (request) => {
  const { headers } = request.event;
  const token = headers.Authorization || headers.authorization;

  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Token no proporcionado." }),
    };
  }

  try {
    const user = jwt.verify(token, SECRET_KEY);
    request.context.user = user;
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Token inválido o expirado." }),
    };
  }
};
