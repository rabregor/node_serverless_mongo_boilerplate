import { ApolloServer } from "@apollo/server";
import context from "./context.js";
import { createSchema } from "./schema.js";
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from "@as-integrations/aws-lambda";
import connectDB from "../scripts/connect.js"; // Import your database connection function
import { paginate, flatten } from "./directives/index.js";
// Ensure a connection is established when needed
async function establishConnection() {
  try {
    await connectDB();
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

establishConnection();
const schema = createSchema();
const server = new ApolloServer({
  schema,
  schemaDirectives: { paginate, flatten },
  context: async () => {
    await establishConnection();
    return context();
  },
  playground:
    process.env.NODE_ENV !== "production"
      ? {
          endpoint: "/graphql",
        }
      : false,
});

export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
);
