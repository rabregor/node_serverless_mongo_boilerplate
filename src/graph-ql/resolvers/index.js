import * as users_mutations from "./users/mutations.js";
import * as users_queries from "./users/queries.js";

export const resolvers = {
  Query: {
    ...users_queries.default,
  },
  Mutation: {
    ...users_mutations.default,
  },
};
