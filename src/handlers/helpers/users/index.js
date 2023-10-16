import * as models from "../../../models/index.js";
import responses from "../../../utils/responses.js";

const fetchUsersOrganization = async (users) => {
  const usersWithOrg = [];
  for (let user of users) {
    if (user.organization) {

      // const org = await models.Organization.get(user.organization);
      const org = await models.Organization.findById(user.organization);

      user.organization = org ? org.toJSON() : null;
      usersWithOrg.push(user);
    }
  }
  return usersWithOrg;
};

export const getAllUsers = async (_, { user }) => {
  if (user.type !== "admin") {
    /*
    const orgUsers = await models.User.query("organization")
      .using("OrganizationIndex")
      .eq(user.organization)
      .exec();
    */

    const orgUsers = await models.User.find({organization: user.organization});

    if (!orgUsers) {
      return responses.notFound("Users");
    }
    const users = orgUsers.toJSON();
    const usersWithOrg = await fetchUsersOrganization(users);

    const usersWithoutPassword = usersWithOrg.map((user) => {
      delete user.password;
      return user;
    });
    return responses.success("users", usersWithoutPassword);
  }

  try {
    // Fetch all users
    //const allUsers = await models.User.scan().exec();
    const allUsers = await models.User.find({});
    const users = allUsers.toJSON();
    const usersWithOrg = await fetchUsersOrganization(users);

    const usersWithoutPassword = usersWithOrg.map((user) => {
      delete user.password;
      return user;
    });
    return responses.success("users", usersWithoutPassword);
  } catch (error) {
    console.error("Error fetching all users:", error);
    return responses.internalError(error);
  }
};

// duda
export const getUserById = async (
  { pathParameters: { id: userId } },
  { user },
) => {
  try {
    // const fetchedUser = await models.User.get(userId);
    const fetchedUser = await models.User.findById(userId);

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
    delete fetchedUser.password;
    return responses.success("user", fetchedUser);
  } catch (error) {
    console.error(`Error fetching user by ID ${userId}:`, error);
    return responses.internalError(error);
  }
};

export const getUserByToken = async (_, { user }) => {
  try {
    //const fetchedUser = await models.User.get(user.email);
    const fetchedUser = await models.User.findOne({ email: user.email });
    if (!fetchedUser) {
      return responses.notFound("User");
    }
    delete fetchedUser.password;
    return responses.success("user", fetchedUser);
  } catch (error) {
    return responses.internalError(error);
  }
};

export const updateUser = async ({ pathParameters: { id }, body }) => {
  try {
    if (!id) {
      return responses.badRequest("Missing user id");
    }
    const { name, lastName, email, type, isEnterprise, organization } = body;

    /*
    const userToUpdate = await models.User.get({
      email: id,
    });
    */

    const userToUpdate = await models.User.findOne({ email: id });

    if (!userToUpdate) {
      return responses.notFound("User");
    }

    userToUpdate.name = name ?? userToUpdate.name;
    userToUpdate.lastName = lastName ?? userToUpdate.lastName;
    userToUpdate.type = type ?? userToUpdate.type;
    userToUpdate.email = email ?? userToUpdate.email;
    userToUpdate.isEnterprise = isEnterprise ?? userToUpdate.isEnterprise;
    userToUpdate.organization = organization ?? userToUpdate.organization;

    const updatedUser = await userToUpdate.save();

    return responses.success("user", updatedUser);
  } catch (err) {
    console.log(err);
    return responses.internalError("Failed to update user");
  }
};
