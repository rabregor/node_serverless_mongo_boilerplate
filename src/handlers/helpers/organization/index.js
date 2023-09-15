import * as models from "../../../models/index.js";
import { createUUID } from "../../../utils/functions.js";
import responses from "../../../utils/responses.js";

const createOrganization = async ({ body: { name } }) => {
  const newOrganization = new models.Organization({
    id: createUUID(),
    name,
  });

  try {
    await newOrganization.save();
    return responses.created("organization", newOrganization);
  } catch (error) {
    return responses.internalError(error);
  }
};

export { createOrganization };
