import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const awsConfig = {
  accessKeyId: process.env.CLI_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.CLI_AWS_SECRET_ACCESS_KEY,
  region: process.env.CLI_AWS_REGION,
  s3Bucket: process.env.CLI_AWS_S3_BUCKET,
};

const env = {
  development: process.env.NODE_ENV === "development",
  production: process.env.NODE_ENV === "production",
};

const mongo = {
  url: process.env.MONGO_URI,
};

export { SECRET_KEY, awsConfig, env, mongo };
