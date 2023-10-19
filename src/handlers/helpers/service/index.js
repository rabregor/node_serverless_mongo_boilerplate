import responses from "../../../utils/responses.js";
import * as models from "../../../models/index.js";
import { Types } from "mongoose";

export const getAllServices = async (_, { user }) => {
  if (user.type === "admin") {
    const allServices = await models.Service.find({});
    return responses.success("services", allServices);
  }

  const services = await models.Service.find({
    organization: Types.ObjectId(user.organization),
  });

  return responses.success("services", services);
};

export const getServiceById = async (
  { pathParameters: { id, organization } },
  { user },
) => {
  const service = await models.Service.findOne({
    _id: Types.ObjectId(id),
    organization: Types.ObjectId(organization),
  });

  if (!service) {
    return responses.notFound("Service");
  }

  if (user.type !== "admin" && user.organization !== requirement.organization) {
    return responses.forbidden("You do not have access to this requirement");
  }

  return responses.success("service", service);
};

export const createService = async ({ body }, { user }) => {
  try {
    const { step, status, organization, type, startDate, endDate } = body;

    const newService = new models.Service({
      step,
      status,
      organization,
      user: user._id,
      type,
      startDate,
      endDate,
    });

    await newService.save();

    return responses.created("service", { service: newService });
  } catch (err) {
    console.log(err);
    return responses.internalError(err);
  }
};

export const updateService = async ({
  body,
  pathParameters: { id, organization },
}) => {
  try {
    const {
      step,
      status,
      organization: orgUpdate,
      user,
      type,
      startDate,
      endDate,
    } = body;

    const serviceToUpdate = await models.Service.findOne({
      _id: Types.ObjectId(id),
      organization: Types.ObjectId(organization),
    });

    if (!serviceToUpdate) {
      return responses.notFound("service");
    }

    serviceToUpdate.step = step ?? serviceToUpdate.step;
    serviceToUpdate.status = status ?? serviceToUpdate.status;
    serviceToUpdate.organization = orgUpdate ?? serviceToUpdate.organization;
    serviceToUpdate.user = user ?? serviceToUpdate.user;
    serviceToUpdate.type = type ?? serviceToUpdate.type;
    serviceToUpdate.startDate = startDate ?? serviceToUpdate.startDate;
    serviceToUpdate.endDate = endDate ?? serviceToUpdate.endDate;

    const updatedService = await serviceToUpdate.save();

    return responses.success("service", updatedService);
  } catch (err) {
    console.log(err);
    return responses.internalError(err);
  }
};
