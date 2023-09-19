import * as models from "../../../models/index.js";
import { createUUID } from "../../../utils/functions.js";
import responses from "../../../utils/responses.js";

const createOrganization = async ({ body: { name, rfc } }) => {
  if (!name) return responses.badRequest("name");

  const newOrganization = new models.Organization({
    id: createUUID(),
    name,
    rfc,
  });

  try {
    await newOrganization.save();
    return responses.created("organization", newOrganization);
  } catch (error) {
    return responses.internalError(error);
  }
};

const getAllOrganizations = async (_, { user }) => {
  if (user.type !== "admin") {
    return responses.forbidden("You do not have access to this resource");
  }
  const organizations = await models.Organization.scan().exec();
  return responses.success("organizations", organizations);
};

const getOrganizationById = async ({ pathParameters: { id } }) => {
  const organization = await models.Organization.get({ id });
  if (!organization) {
    return responses.notFound("Organization");
  }
  return responses.success("organization", organization);
};

export { createOrganization, getOrganizationById, getAllOrganizations };
