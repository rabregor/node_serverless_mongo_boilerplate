import models from "../../../models/index.js";
import { buildQuery } from "../../../utils/builders.js";

const userQueries = {
  users: async (_, { params = { page: 1, pageSize: 20 }, ...args }) => {
    const { pageSize, page } = params;

    let query = {};

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
      results: results.map((result) => {
        return {
          ...result._doc,
          id: result._id,
        };
      }),
      count,
      params,
    };
  },
  user: async (_, { id }, { loaders }) => {
    return loaders.user.one(id);
  },
};

export default userQueries;
