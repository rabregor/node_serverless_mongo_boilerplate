import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as models from "../../../models/index.js";
import { SECRET_KEY } from "../../../config/environment.js";
import responses from "../../../utils/responses.js";

const registerUser = async ({ body }, { user }) => {
  if (user.type !== "admin") {
    return responses.forbidden("Only admins can create users!");
  }

  if (!body.organization || !body.email)
    return responses.badRequest("organization");

  const existingUser = await models.User.query("email").eq(body.email).exec();
  if (existingUser.count > 0) {
    return responses.forbidden("User / email already exists!");
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
    const userOrg = await models.Organization.get({ id: body.organization });
    let response = newUser.toJSON();
    response.organization = userOrg;
    return responses.created("user", response);
  } catch (error) {
    return responses.internalError(error);
  }
};

const authenticateUser = async ({ body }) => {
  const { email, password } = body;

  try {
    const user = await models.User.get({ email });
    if (!user) {
      return responses.notFound("User");
    }
    const isMatch = await bcrypt.compare(password, user?.password);

    if (!isMatch) {
      return responses.forbidden("Invalid credentials!");
    }

    const payload = {
      email,
      organization: user.organization,
      type: user.type,
    };

    // Generate JWT
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
    return responses.success("token", token, { user: payload });
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }
};

export { registerUser, authenticateUser };
