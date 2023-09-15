import * as models from "../../../models/index.js";
import responses from "../../../utils/responses.js";

export const getAllUsers = async (_, { user }) => {
  if (user.type !== "admin") {
    return responses.forbidden;
  }

  try {
    const users = await models.User.scan().exec();
    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (error) {
    console.error("Error fetching all users:", error);
    return responses.internalError(error);
  }
};

export const getUserById = async (event, { user }) => {
  const userId = event.pathParameters.id;

  try {
    const fetchedUser = await models.User.get(userId);

    if (!fetchedUser) {
      return responses.notFound("User");
    }
    if (
      user.type !== "admin" &&
      user.organization !== fetchedUser.organization
    ) {
      return responses.forbidden;
    }

    return responses.success("user", fetchedUser);
  } catch (error) {
    console.error(`Error fetching user by ID ${userId}:`, error);
    return responses.internalError(error);
  }
};
