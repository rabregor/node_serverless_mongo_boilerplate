import AWS from "aws-sdk";

// Initialize DynamoDB Document Client
const dynamo = new AWS.DynamoDB.DocumentClient();

export const getItem = async (tableName, key) => {
  const params = {
    TableName: tableName,
    Key: key,
  };
  try {
    const result = await dynamo.get(params).promise();
    return result.Item;
  } catch (error) {
    console.error(`DynamoDB getItem failed for table ${tableName}:`, error);
    return null;
  }
};

export const putItem = async (tableName, item) => {
  const params = {
    TableName: tableName,
    Item: item,
  };
  try {
    await dynamo.put(params).promise();
    return true;
  } catch (error) {
    console.error(`DynamoDB putItem failed for table ${tableName}:`, error);
    return false;
  }
};

export const deleteItem = async (tableName, key) => {
  const params = {
    TableName: tableName,
    Key: key,
  };
  try {
    await dynamo.delete(params).promise();
    return true;
  } catch (error) {
    console.error(`DynamoDB deleteItem failed for table ${tableName}:`, error);
    return false;
  }
};

export const getAllItems = async (tableName) => {
  const params = {
    TableName: tableName,
  };
  try {
    const result = await dynamo.scan(params).promise();
    return result.Items;
  } catch (error) {
    console.error(`DynamoDB scan failed for table ${tableName}:`, error);
    return [];
  }
};

export const updateItem = async (
  tableName,
  key,
  updateExpression,
  expressionAttributeValues,
) => {
  const params = {
    TableName: tableName,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };
  try {
    const result = await dynamo.update(params).promise();
    return result.Attributes;
  } catch (error) {
    console.error(`DynamoDB updateItem failed for table ${tableName}:`, error);
    return null;
  }
};
