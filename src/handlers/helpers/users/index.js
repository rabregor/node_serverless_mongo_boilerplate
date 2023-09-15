import * as models from "../../../models/index.js";
import responses from "../../../utils/responses.js";

export const getAllUsers = async (_, { user }) => {
  if (user.type !== "admin") {
    const orgUsers = await models.User.query("organization")
      .using("OrganizationIndex")
      .eq(user.organization)
      .exec();

    if (!orgUsers) {
      return responses.notFound("Users");
    }

    return responses.success("users", orgUsers);
  }

  try {
    const users = await models.User.scan().exec();
    return responses.success("users", users.toJSON());
  } catch (error) {
    console.error("Error fetching all users:", error);
    return responses.internalError(error);
  }
};

export const getUserById = async (event, { user }) => {
  const userId = event.pathParameters.id;

  try {
    const fetchedUser = await models.User.get(userId);

    if (
      user.type !== "admin" &&
      fetchedUser.organization !== user.organization
    ) {
      return responses.forbidden("User not from same organization");
    }

    if (!fetchedUser) {
      return responses.notFound("User");
    }
    if (
      user.type !== "admin" &&
      user.organization !== fetchedUser.organization
    ) {
      return responses.forbidden("User not from same organization");
    }

    return responses.success("user", fetchedUser);
  } catch (error) {
    console.error(`Error fetching user by ID ${userId}:`, error);
    return responses.internalError(error);
  }
};
