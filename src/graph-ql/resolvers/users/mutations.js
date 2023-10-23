import models from "../../../models/index.js";

const userMutations = {
  createUser: async (_, args, { loaders, user: { organization } }) => {
    const newUser = await new models.User({ ...args, organization });
    await newUser.save();

    return loaders.user.one(newUser._id);
  },
  updateUser: async (_, { id, user }, { loaders }) => {
    const updatedUser = await models.User.findByIdAndUpdate(
      id,
      {
        $set: {
          ...user,
        },
      },
      { new: true },
    );
    return loaders.user.one(updatedUser._id);
  },
};

export default userMutations;
