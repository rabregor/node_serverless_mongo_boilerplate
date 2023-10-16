import { createUUID } from "../../../utils/functions.js";
import responses from "../../../utils/responses.js";
import * as models from "../../../models/index.js";

export const getAllRequirements = async (_, { user }) => {
  if (user.type === "admin") {
    
    // const allRequirements = await models.Requirement.scan().exec();
    const allRequirements = await models.Requirement.find({});

    for (const requirement of allRequirements) {
      if (requirement.file !== "" && requirement.folder !== "") {
        /*
        const file = await models.File.get({
          id: requirement.file,
          folder: requirement.folder,
        });
        */
        const file = await models.File.findOne({
          id: requirement.file,
          folder: requirement.folder,
        });

        requirement.file = file ? file : null;
      }
    }
    return responses.success("requirements", allRequirements);
  }

  /*
  const requirements = await models.Requirement.query("organization")
    .eq(user.organization)
    .exec();
  */

  const requirements = await models.Requirement.findById(user.organization);

  for (const requirement of requirements) {
    if (requirement.file !== "" && requirement.folder !== "") {
      /*
      const file = await models.File.get({
        id: requirement.file,
        folder: requirement.folder,
      });
      */
      const file = await models.File.findOne({
        id: requirement.file,
        folder: requirement.folder,
      });

      requirement.file = file ? file : null;
    }
  }

  return responses.success("requirements", requirements);
};

export const getRequirementById = async (
  { pathParameters: { id, organization } },
  { user },
) => {
  // const requirement = await models.Requirement.get({ id, organization });
  const requirement = await models.Requirement.findOne({ id, organization });

  if (!requirement) {
    return responses.notFound("Requirement");
  }

  if (user.type !== "admin" && user.organization !== requirement.organization) {
    return responses.forbidden("You do not have access to this requirement");
  }

  if (requirement.file !== "" && requirement.folder !== "") {
    /*
    const file = await models.File.get({
      id: requirement.file,
      folder: requirement.folder,
    });
    */
    const file = await models.File.findOne({ id: requirement.file, folder: requirement.folder });

    requirement.file = file ? file : null;
  }

  return responses.success("requirement", requirement);
};

export const createRequirement = async ({ body }) => {
  try {
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

    await newRequirement.save();

    return responses.created("requirement", { requirement: newRequirement });
  } catch (err) {
    console.log(err);
    return responses.internalError(err);
  }
};

export const updateRequirement = async ({
  body,
  pathParameters: { id, organization },
}) => {
  try {
    const { folder, requirement, status, file, organization: orgUpdate } = body;

    /*
    const requirementToUpdate = await models.Requirement.get({
      id,
      organization,
    });
    */

    const requirementToUpdate = await models.Requirement.findOne({ id, organization });

    if (!requirementToUpdate) {
      return responses.notFound("Requirement");
    }

    requirementToUpdate.folder = folder ?? requirementToUpdate.folder;
    requirementToUpdate.requirement =
      requirement ?? requirementToUpdate.requirement;
    requirementToUpdate.status = status ?? requirementToUpdate.status;
    requirementToUpdate.file = file ?? requirementToUpdate.file;
    requirementToUpdate.organization =
      orgUpdate ?? requirementToUpdate.organization;

    const updatedRequirement = await requirementToUpdate.save();

    return responses.success("requirement", updatedRequirement);
  } catch (err) {
    console.log(err);
    return responses.internalError(err);
  }
};
