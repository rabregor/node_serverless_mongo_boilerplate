import AWS from 'aws-sdk';

// Initialize S3
const s3 = new AWS.S3();

export const uploadFile = async (bucketName, key, body) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: body
  };
  try {
    await s3.upload(params).promise();
    return true;
  } catch (error) {
    console.error('S3 uploadFile failed:', error);
    return false;
  }
};

export const getFile = async (bucketName, key) => {
  const params = {
    Bucket: bucketName,
    Key: key
  };
  try {
    const data = await s3.getObject(params).promise();
    return data.Body;
  } catch (error) {
    console.error('S3 getFile failed:', error);
    return null;
  }
};

export const deleteFile = async (bucketName, key) => {
  const params = {
    Bucket: bucketName,
    Key: key
  };
  try {
    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    console.error('S3 deleteFile failed:', error);
    return false;
  }
};

// Additional S3 operations can be added here...
