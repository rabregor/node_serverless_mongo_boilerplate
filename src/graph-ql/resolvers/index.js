import fs from "fs";
import { join } from "path";
import GraphQLJSON from "graphql-type-json";

async function loadResolvers(baseDir) {
  let resolvers = {
    JSON: GraphQLJSON,
    Query: {},
    Mutation: {},
  };

  const imports = [];
  try {
    for (const file of fs.readdirSync(baseDir)) {
      const path = join(baseDir, file);
      if (fs.statSync(path).isDirectory() && path.includes("/resolvers")) {
        const nestedResolvers = await loadResolvers(path);
        resolvers.Query = { ...resolvers.Query, ...nestedResolvers.Query };
        resolvers.Mutation = {
          ...resolvers.Mutation,
          ...nestedResolvers.Mutation,
        };
      } else if (baseDir.includes("/resolvers")) {
        let resolversAt = undefined;

        if (path.endsWith("queries.js")) resolversAt = "Query";
        if (path.endsWith("mutations.js")) resolversAt = "Mutation";
        if (path.endsWith("test.js")) continue; // Use 'continue' instead of 'return' in loops

        if (resolversAt) {
          imports.push(
            import(path).then((module) => {
              resolvers[resolversAt] = {
                ...resolvers[resolversAt],
                ...module.default,
              };
            }),
          );
        } else {
          imports.push(
            import(path).then((module) => {
              resolvers = {
                ...resolvers,
                ...module.default,
              };
            }),
          );
        }
      }
    }

    await Promise.all(imports);
    return resolvers;
  } catch (err) {
    console.log("Error loading resolvers: ", err);
  }
}

export { loadResolvers };
