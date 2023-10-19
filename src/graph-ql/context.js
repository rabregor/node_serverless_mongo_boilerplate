import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/environment.js";
import models from "../models/index.js";
import createLoader from "./loaders.js";

const contextQueryArgs = (organization) => {
  return { organization };
};

const context = async ({ req = {}, connection }) => {
  const loaders = Object.entries(models).reduce((obj, [key, value]) => {
    key = String(key).toLowerCase();
    obj[key] = createLoader(value);
    return obj;
  }, {});

  let token, authorization;

  if (connection) authorization = connection.context.authorization;
  else authorization = req.headers.authorization;

  if (authorization) [, token] = authorization.split("Bearer ");
  if (!token)
    throw new Error("GraphQL API is only accessible with an access token");

  const user = jwt.verify(token, SECRET_KEY);

  const queryArgs = contextQueryArgs(user?.organization);

  return { user, queryArgs, loaders };
};

export default context;
