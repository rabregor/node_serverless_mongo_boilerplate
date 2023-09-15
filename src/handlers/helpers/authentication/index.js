import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as models from "../../../models/index.js";
import { SECRET_KEY } from "../../../config/environment.js";
import responses from "../../../utils/responses.js";

const registerUser = async ({ body }, { user }) => {
  if (user.type !== "admin") {
    return responses.forbidden;
  }

  const { password, ...rest } = body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new models.User({
    password: hashedPassword,
    ...rest,
  });

  try {
    await newUser.save();
    return responses.created("user", newUser);
  } catch (error) {
    return responses.internalError(error);
  }
};

const authenticateUser = async ({ body }) => {
  const { email, password } = body;

  try {
    const user = await models.User.get({ email });
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }
    const isMatch = await bcrypt.compare(password, user?.password);

    if (!isMatch) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Unauthorized" }),
      };
    }

    const payload = {
      email,
      organization: user.organization,
      type: user.type,
    };

    // Generate JWT
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Authenticated!", token, user: payload }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }
};

export { registerUser, authenticateUser };
