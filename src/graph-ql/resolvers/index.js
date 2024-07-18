import users_mutations from "./users/mutations.js";
import users_queries from "./users/queries.js";

export const resolvers = {
  Query: {
    ...users_queries,
  },
  Mutation: {
    ...users_mutations,
  },
};
