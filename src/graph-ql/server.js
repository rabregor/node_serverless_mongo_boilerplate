import { ApolloServer } from "@apollo/server";
import { env } from "../config/environment.js";
import context from "./context.js";
import { flatten, paginate } from "./directives/index.js";
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from "@as-integrations/aws-lambda";

const playgroundSettings = {
  settings: {
    "editor.theme": "dark",
    "request.credentials": "include",
    "schema.polling.enable": false,
  },
};

// The GraphQL schema

const typeDefs = `#graphql

  type Query {

    hello: String

  }

`;

// A map of functions which return data for the schema.

const resolvers = {
  Query: {
    hello: () => "world",
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  // We will be using the Proxy V2 handler
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
);
