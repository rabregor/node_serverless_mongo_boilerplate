import AWS from 'aws-sdk';

// Initialize DynamoDB Document Client
const dynamo = new AWS.DynamoDB.DocumentClient();

export const getItem = async (tableName, key) => {
  const params = {
    TableName: tableName,
    Key: key
  };
  try {
    const result = await dynamo.get(params).promise();
    return result.Item;
  } catch (error) {
    console.error('DynamoDB getItem failed:', error);
    return null;
  }
};

export const putItem = async (tableName, item) => {
  const params = {
    TableName: tableName,
    Item: item
  };
  try {
    await dynamo.put(params).promise();
    return true;
  } catch (error) {
    console.error('DynamoDB putItem failed:', error);
    return false;
  }
};

export const deleteItem = async (tableName, key) => {
  const params = {
    TableName: tableName,
    Key: key
  };
  try {
    await dynamo.delete(params).promise();
    return true;
  } catch (error) {
    console.error('DynamoDB deleteItem failed:', error);
    return false;
  }
};

// Additional DynamoDB operations can be added here...
