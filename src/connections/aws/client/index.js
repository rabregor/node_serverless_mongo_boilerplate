import AWS from "aws-sdk";
import { awsConfig } from "../../../config/environment.js";

AWS.config.update({
  ...awsConfig,
});

export default AWS;
