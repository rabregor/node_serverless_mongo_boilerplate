import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const awsConfig = {
  region: "us-east-1",
  s3: {
    bucketName: process.env.AWS_BUCKET_NAME,
  },
};

<<<<<<< HEAD
const env = {
  development: process.env.NODE_ENV === "development",
  production: process.env.NODE_ENV === "production",
};

export { SECRET_KEY, awsConfig, env };
=======
const mongo = {
  url: process.env.MONGO_URI,
};

export { SECRET_KEY, awsConfig, mongo };
>>>>>>> f981086 (added mongo uri environment variable)
