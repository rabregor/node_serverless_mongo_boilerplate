import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as models from "../../../models/index.js";
import { SECRET_KEY } from "../../../config/environment.js";
import responses from "../../../utils/responses.js";
import connectDB from "../../../utils/connect.js"
import { Types } from "mongoose"

const registerUser = async ({ body }, { user }) => {
  if (user.type !== "admin") {
    return responses.forbidden("Only admins can create users!");
  }

  if (!body.organization)
    return responses.badRequest("organization");

  if (!body.email)
    return responses.badRequest("email");

  //const existingUser = await models.User.query("email").eq(body.email).exec();
  const existingUser = await models.User.find({ email: body.email });

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
    // const userOrg = await models.Organization.get({ id: body.organization });
    const userOrg = await models.Organization.findById(new Types.ObjectId(body.organization));
    newUser.organization = userOrg;
    return responses.created("user", newUser);
  } catch (error) {
    return responses.internalError(error);
  }
};

const authenticateUser = async ({ body }) => {

  const { email, password } = body;

  try {
    // const user = await models.User.get({ email });
    await connectDB();
    const user = await models.User.findOne({email});

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
