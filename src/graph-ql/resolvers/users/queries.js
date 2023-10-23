import models from "../../../models/index.js";
import { buildQuery } from "../../../utils/builders.js";

const userQueries = {
  users: async (
    _,
    { params = { page: 1, pageSize: 20 }, ...args },
    { loaders, queryArgs },
  ) => {
    const { pageSize, page } = params;
    console.log("triggered");
    let query = {
      ...queryArgs,
    };

    if (args?.userType != undefined) {
      query = {
        ...query,
        ...buildQuery(args.userType, "userType"),
      };
    }

    const [results, count] = await Promise.all([
      models.User.find(query)
        .skip(pageSize * (page - 1))
        .limit(pageSize),
      models.User.countDocuments(),
    ]);
    return {
      results: loaders.user.many(
        results.map(({ id }) => id),
        loaders,
      ),
      count,
      params,
    };
  },
  user: async (_, { id }, { loaders }) => {
    return loaders.user.one(id);
  },
};

export default userQueries;
