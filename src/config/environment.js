import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
  s3: {
    bucketName: process.env.AWS_BUCKET_NAME,
  },
};

const env = {
  development: process.env.NODE_ENV === "development",
  production: process.env.NODE_ENV === "production",
};

export { SECRET_KEY, awsConfig, env };
