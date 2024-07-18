import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import models from "../../../models/index.js";
import { SECRET_KEY } from "../../../config/environment.js";
import responses from "../../../utils/responses.js";
import connectDB from "../../../scripts/connect.js";

const registerUser = async ({ body }) => {
  try {
    await connectDB();
    const existingUser = await models.User.find({ email: body.email });

    if (existingUser.count > 0) {
      return responses.forbidden("User / email already exists!");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const newUser = new models.User({
      email: body.email,
      password: hashedPassword,
      name: body.name,
      lastName: body.lastName,
      type: "client",
      phone: body.phone,
    });

    await newUser.save();

    const payload = {
      id: String(newUser._id),
      email: newUser.email,
      type: newUser.type,
      phone: newUser?.phone,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
    return responses.success("token", token, { user: payload });
  } catch (error) {
    console.log(error);
    return responses.internalError(error);
  }
};

const authenticateUser = async ({ body }) => {
  const { email, password } = body;
  try {
    // const user = await models.User.get({ email });
    await connectDB();
    const user = await models.User.findOne({ email });

    if (!user) {
      return responses.notFound("User");
    }

    const isMatch = await bcrypt.compare(password, user?.password);

    if (!isMatch) {
      return responses.forbidden("Invalid credentials!");
    }

    const payload = {
      id: String(user._id),
      email,
      type: user.type,
      phone: user?.phone,
    };

    // Generate JWT
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
    return responses.success("token", token, { user: payload });
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }
};

export { registerUser, authenticateUser };
