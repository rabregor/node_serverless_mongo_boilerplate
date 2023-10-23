// main.js
import { ApolloServer } from "@apollo/server";
import context from "./context.js";
import { flatten, paginate } from "./directives/index.js";
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from "@as-integrations/aws-lambda";
import { createSchema } from "./schema.js";

async function initialize() {
  const schema = await createSchema();
  const server = new ApolloServer({
    schema,
    context,
    playground: {
      endpoint: "/graphql",
    },
  });
  return server;
}

let serverInstance;

export async function getHandler() {
  if (!serverInstance) {
    serverInstance = await initialize();
  }

  return startServerAndCreateLambdaHandler(
    serverInstance,
    handlers.createAPIGatewayProxyEventV2RequestHandler(),
  );
}
