import { getAllItems, getItem } from "../../../utils/dynamoHandler.js";
import responses from "../../../utils/responses.js";

export const getAllUsers = async (event, { user }) => {
  if (user.type !== "admin") {
    return responses.forbidden;
  }

  const tableName = "Users";

  try {
    const users = await getAllItems(tableName);
    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (error) {
    console.error("Error fetching all users:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to fetch users" }),
    };
  }
};

export const getUserById = async (event, { user }) => {
  if (user.type !== "admin") {
    return responses.forbidden;
  }
  const userId = event.pathParameters.id;

  const key = { userId };
  const tableName = "Users";

  try {
    const user = await getItem(tableName, key);

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error) {
    console.error(`Error fetching user by ID ${userId}:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to fetch user" }),
    };
  }
};
