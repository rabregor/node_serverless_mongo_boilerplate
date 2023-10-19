import fs from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import GraphQLJSON from "graphql-type-json";

let resolvers = {
  JSON: GraphQLJSON,
  Query: {},
  Mutation: {},
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function loadResolvers(dir) {
  const imports = [];
  fs.readdirSync(dir).forEach((file) => {
    const path = join(dir, file);
    if (fs.statSync(path).isDirectory()) {
      return loadResolvers(path);
    } else {
      let resolversAt = undefined;

      if (path.endsWith("queries.js")) resolversAt = "Query";
      if (path.endsWith("mutations.js")) resolversAt = "Mutation";
      if (path.endsWith("test.js")) return;

      if (resolversAt) {
        imports.push(
          import(path).then((module) => {
            resolvers[resolversAt] = {
              ...module.default,
              ...resolvers[resolversAt],
            };
          }),
        );
      } else {
        imports.push(
          import(path).then((module) => {
            resolvers = {
              ...module.default,
              ...resolvers,
            };
          }),
        );
      }
    }
  });
  await Promise.all(imports);
}

// Use an IIFE to call the async function
(async () => {
  await loadResolvers(__dirname);
})();

export default resolvers;
