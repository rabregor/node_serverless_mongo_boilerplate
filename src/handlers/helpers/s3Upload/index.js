import AWS from "aws-sdk";
import { createUUID } from "../../../utils/functions.js";
import responses from "../../../utils/responses.js";
import { awsConfig } from "../../../config/environment.js";

const {
  s3: { bucketName },
} = awsConfig;

const s3 = new AWS.S3();
export const s3Upload = async ({ body }) => {
  try {
    const { name, type } = body;

    const s3FileKey = `${createUUID()}/${name}`;
    const s3Params = {
      Bucket: bucketName,
      Key: s3FileKey,
      ContentType: type,
      ACL: "public-read", // Set the permissions as per your requirements
    };
    const uploadURL = await s3.getSignedUrlPromise("putObject", s3Params);
    return responses.success("uploadURL", uploadURL);
  } catch (error) {
    console.error(error);
    return responses.internalError(error);
  }
};
