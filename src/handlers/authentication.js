import AWS from 'aws-sdk';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/environment.js';
import { dynamoConfig } from '../utils/constants.js';

// Initialize DynamoDB Document Client
const dynamo = new AWS.DynamoDB.DocumentClient();

export const registerUser = async (event, context) => {
  const { email, password } = JSON.parse(event.body);

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Store the new user in DynamoDB
  const params = {
    TableName: dynamoConfig.tables.users,
    Item: { email, passwordHash: hashedPassword }
  };

  try {
    await dynamo.put(params).promise();
    return { statusCode: 201, body: JSON.stringify({ message: 'User created' }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }
};

export const authenticateUser = async (event, context) => {
  const { email, password } = JSON.parse(event.body);

  // Fetch user by email
  const params = {
    TableName: dynamoConfig.tables.users,
    Key: { email }
  };

  try {
    const result = await dynamo.get(params).promise();
    const user = result.Item;

    if (!user) {
      return { statusCode: 404, body: JSON.stringify({ message: 'User not found' }) };
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (isMatch) {
      // Generate JWT
      const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '24h' }); // Expires in 24 hours
      return { statusCode: 200, body: JSON.stringify({ message: 'Authenticated!', token }) };
    } else {
      return { statusCode: 401, body: JSON.stringify({ message: 'Unauthorized' }) };
    }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }
};
