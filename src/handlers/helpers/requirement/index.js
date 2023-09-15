import { createUUID } from "../../../utils/functions.js";
import responses from "../../../utils/responses.js";
import * as models from "../../../models/index.js";

export const getAllRequirements = async (
  { body: { organization } },
  { user },
) => {
  if (user.type !== "admin" && !organization) {
    return responses.forbidden;
  }

  const requirements = await models.Requirement.scan().exec();

  return responses.success("requirements", requirements);
};

export const getRequirementById = async (event, { user }) => {
  const requirementId = event.pathParameters.id;
  const requirement = await models.Requirement.get(requirementId);

  if (!requirement) {
    return responses.notFound("Requirement");
  }

  if (user.type !== "admin" && user.organization !== requirement.organization) {
    return responses.forbidden;
  }

  return {
    statusCode: 200,
    body: JSON.stringify(requirement),
  };
};

export const createRequirement = async ({ body }) => {
  const { folder, requirement, status, file, organization } = body;
  const requirementId = createUUID();

  const newRequirement = new models.Requirement({
    id: requirementId,
    folder,
    requirement,
    status,
    file,
    organization,
  });

  const success = await newRequirement.save();

  return success
    ? responses.created("requirement", { requirement: newRequirement })
    : responses.internalError("Failed to create requirement");
};

export const updateRequirement = async (event) => {
  const requirementId = event.pathParameters.id;
  const { folder, requirement, status, file, organization } = event.body;

  const requirementToUpdate = await models.Requirement.get(requirementId);

  if (!requirementToUpdate) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Requirement not found" }),
    };
  }

  requirementToUpdate.folder = folder;
  requirementToUpdate.requirement = requirement;
  requirementToUpdate.status = status;
  requirementToUpdate.file = file;
  requirementToUpdate.organization = organization;

  const updatedRequirement = await requirementToUpdate.save();

  return updatedRequirement
    ? responses.success("requirement", updatedRequirement)
    : responses.internalError("Failed to update requirement");
};
