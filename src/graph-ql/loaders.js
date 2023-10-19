import DataLoader from "dataloader";

const createLoader = (Model) => {
  const loader = new DataLoader(async (ids) => {
    const data = await Model.find({ _id: { $in: ids } });

    // DataLoaders depend on the order of the input to return the result
    // So, it is needed to map results in order to create a correct output
    const dataMap = data.reduce((acc, curr) => {
      acc[curr._id] = curr;
      return acc;
    }, {});

    return ids.map((id) => dataMap[id]);
  });

  const resolve = {
    // eslint-disable-next-line no-unused-vars
    one: (doc, loaders) => {
      return {
        ...doc._doc,
        id: doc._doc._id,
      };
    },
    // eslint-disable-next-line no-unused-vars
    many: (docs, loaders) => {
      return docs.map((doc, loaders) => resolve.one(doc, loaders));
    },
  };

  return {
    one: async (id, loaders) => {
      if (!id) return null;
      const result = await loader.load(id.toString());
      return resolve.one(result, loaders);
    },
    many: async (ids, loaders) => {
      const results = await loader.loadMany(ids.map((id) => id.toString()));
      return resolve.many(results, loaders);
    },
  };
};

export default createLoader;
