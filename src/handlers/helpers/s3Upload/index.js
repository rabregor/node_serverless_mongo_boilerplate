import AWS from "aws-sdk";
import { createUUID } from "../utils/functions";
import responses from "../utils/responses";
import { awsConfig } from "../config/environment";

const {
  s3: { bucketName },
} = awsConfig;

const s3 = new AWS.S3();

export const s3Upload = async ({ body }) => {
  const { name, type } = body;

  const s3FileKey = `${createUUID()}/${name}`;
  const s3Params = {
    Bucket: bucketName,
    Key: s3FileKey,
    ContentType: type,
    ACL: "public-read", // Set the permissions as per your requirements
  };

  try {
    const uploadURL = await s3.getSignedUrlPromise("putObject", s3Params);
    responses.success("uploadURL", uploadURL);
  } catch (error) {
    responses.internalError(error);
  }
};
