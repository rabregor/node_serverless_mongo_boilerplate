import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { authenticateJWT } from "../middlewares/auth.js";
import { s3Upload } from "./helpers/s3Upload/index.js";

export const s3UploadHandler = middy(async (event, context) => {
  return s3Upload(event, context);
})
  .use(httpJsonBodyParser())
  .before(authenticateJWT);
