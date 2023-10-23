import { ApolloServer } from "@apollo/server";
import customContext from "./context.js";
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
  {
    context: async ({ event, context }) => {
      await establishConnection();

      // Use the custom context generation
      const apolloContext = await customContext({
        req: event,
        // Add connection if relevant
      });

      // Merge with any other context info if needed
      return {
        ...apolloContext,
        ...context,
        // ... any other context data ...
      };
    },
  },
);
