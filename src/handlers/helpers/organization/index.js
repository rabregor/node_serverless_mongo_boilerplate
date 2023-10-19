import * as models from "../../../models/index.js";
import responses from "../../../utils/responses.js";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";

const createOrganization = async ({
  body: {
    name,
    rfc,
    numberOfEmployees,
    fiscalPostcode,
    fiscalStreet,
    fiscalExteriorNumber,
    fiscalColony,
    fiscalCity,
    fiscalState,
    fiscalCountry,
  },
}) => {
  if (!name) return responses.badRequest("name");

  const newOrganization = new models.Organization({
    name,
    rfc,
    numberOfEmployees,
    fiscalPostcode,
    fiscalStreet,
    fiscalExteriorNumber,
    fiscalColony,
    fiscalCity,
    fiscalState,
    fiscalCountry,
  });

  try {
    await newOrganization.save();
    return responses.created("organization", newOrganization);
  } catch (error) {
    return responses.internalError(error);
  }
};

const createOrganizationAndUser = async ({
  body: {
    name,
    lastName,
    isEnterprise,
    rfc,
    email,
    password,
    businessName,
    numberOfEmployees,
    address,
  },
}) => {
  if (!businessName || !rfc || !numberOfEmployees) {
    return responses.badRequest("Missing required fields");
  }

  //const organizations = await models.Organization.scan().exec();
  const organizations = await models.Organization.find({});

  const existingOrganization = organizations.find((org) => org.rfc === rfc);
  if (existingOrganization) {
    return responses.internalError("RFC already registered");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newOrganization = new models.Organization({
      name: businessName,
      rfc,
      numberOfEmployees,
      fiscalPostcode: address?.postcode,
      fiscalStreet: address?.street,
      fiscalExteriorNumber: address?.exteriorNumber,
      fiscalColony: address?.colony,
      fiscalCity: address?.city,
      fiscalState: address?.state,
      fiscalCountry: address?.country,
    });
    await newOrganization.save();

    const newUser = new models.User({
      email,
      name,
      lastName,
      password: hashedPassword,
      type: "client",
      organization: String(newOrganization._id),
      isEnterprise,
    });
    await newUser.save();

    return responses.created("organization and user", {
      organization: newOrganization,
      user: newUser,
    });
  } catch (error) {
    return responses.internalError(error);
  }
};

const getAllOrganizations = async (_, { user }) => {
  if (user.type !== "admin") {
    return responses.forbidden("You do not have access to this resource");
  }

  // const organizations = await models.Organization.scan().exec();
  const organizations = await models.Organization.find({});

  return responses.success("organizations", organizations);
};

const getOrganizationById = async ({ pathParameters: { id } }) => {
  //const organization = await models.Organization.get({ id });
  const organization = await models.Organization.findById(
    new Types.ObjectId(id),
  );

  if (!organization) {
    return responses.notFound("Organization");
  }
  return responses.success("organization", organization);
};

const updateOrganization = async ({ pathParameters: { id }, body }) => {
  try {
    if (!id) {
      return responses.badRequest("Missing organization id");
    }
    const {
      name,
      rfc,
      numberOfEmployees,
      fiscalPostcode,
      fiscalStreet,
      fiscalExteriorNumber,
      fiscalColony,
      fiscalCity,
      fiscalState,
      fiscalCountry,
    } = body;

    /*
    const organizationToUpdate = await models.Organization.get({
      id,
    });
    */

    const organizationToUpdate = await models.Organization.findById(
      new Types.ObjectId(id),
    );

    if (!organizationToUpdate) {
      return responses.notFound("Organization");
    }

    organizationToUpdate.name = name ?? organizationToUpdate.name;
    organizationToUpdate.rfc = rfc ?? organizationToUpdate.rfc;
    organizationToUpdate.numberOfEmployees =
      numberOfEmployees ?? organizationToUpdate.numberOfEmployees;
    organizationToUpdate.fiscalPostcode =
      fiscalPostcode ?? organizationToUpdate.fiscalPostcode;
    organizationToUpdate.fiscalStreet =
      fiscalStreet ?? organizationToUpdate.fiscalStreet;
    organizationToUpdate.fiscalExteriorNumber =
      fiscalExteriorNumber ?? organizationToUpdate.fiscalExteriorNumber;
    organizationToUpdate.fiscalColony =
      fiscalColony ?? organizationToUpdate.fiscalColony;
    organizationToUpdate.fiscalCity =
      fiscalCity ?? organizationToUpdate.fiscalCity;
    organizationToUpdate.fiscalState =
      fiscalState ?? organizationToUpdate.fiscalState;
    organizationToUpdate.fiscalCountry =
      fiscalCountry ?? organizationToUpdate.fiscalCountry;

    const updatedOrganization = await organizationToUpdate.save();

    return responses.success("organization", updatedOrganization);
  } catch (err) {
    console.log(err);
    return responses.internalError("Failed to update organization");
  }
};

export {
  createOrganization,
  createOrganizationAndUser,
  getOrganizationById,
  getAllOrganizations,
  updateOrganization,
};
