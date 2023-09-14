import AWS from "aws-sdk";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../../config/environment.js";
import { dynamoConfig } from "../../../utils/constants.js";
import { createUUID } from "../../../utils/functions.js";

const dynamo = new AWS.DynamoDB.DocumentClient();

const createOrganization = async (ownerEmail, organizationName) => {
  const organizationId = createUUID();
  const timestamp = new Date().toISOString();

  const params = {
    TableName: dynamoConfig.tables.organization,
    Item: {
      id: organizationId,
      name: organizationName,
      owner: ownerEmail,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  await dynamo.put(params).promise();
  return organizationId;
};

const registerUser = async (event, { user }) => {
  if (user.type !== "admin") {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "Forbidden" }),
    };
  }
  const {
    email,
    password,
    type,
    organization: orgName,
    name,
    lastName,
    isEnterprise,
  } = JSON.parse(event.body);
  const timestamp = new Date().toISOString(); // Fecha y hora actuales

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Si el usuario es de tipo 'client', crear una nueva organización
  let organizationId = null;
  if (type === "client") {
    organizationId = await createOrganization(email, orgName);
  }

  const params = {
    TableName: dynamoConfig.tables.user,
    Item: {
      email,
      password: hashedPassword,
      type,
      organization: organizationId,
      createdAt: timestamp,
      updatedAt: timestamp,
      name,
      lastName,
      isEnterprise,
    },
  };

  try {
    await dynamo.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({ message: "User created" }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }
};

const authenticateUser = async ({ body }) => {
  const { email, password } = body;

  // Fetch user by email
  const params = {
    TableName: dynamoConfig.tables.user,
    Key: { email },
  };

  try {
    const result = await dynamo.get(params).promise();
    const user = result.Item;

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Unauthorized" }),
      };
    }

    // Generate JWT payload
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
