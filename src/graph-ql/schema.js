import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readdirSync, readFileSync } from "fs";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers } from "./resolvers/index.js";
import { flatten, paginate } from "./directives/index.js";

// Get the equivalent of __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let schema;

export function createSchema() {
  if (!schema) {
    // Read the gql files
    const gqlFiles = readdirSync(join(__dirname, "./typedefs"));
    let typeDefs = "";

    // Iterate over the gqlFiles and read the contents into typeDefs
    gqlFiles.forEach((file) => {
      typeDefs += readFileSync(join(__dirname, "./typedefs", file), {
        encoding: "utf8",
      });
    });
    // Create the schema with type definitions and resolvers
    schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });

    // Apply directives
    schema = paginate(schema, "paginate");
    schema = flatten(schema, "flatten");
  }
  return schema;
}
