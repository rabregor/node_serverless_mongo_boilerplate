const responses = Object.freeze({
  forbidden: (action) => ({
    statusCode: 403,
    body: JSON.stringify({ message: `Forbidden: ${action}` }),
  }),
  notFound: (resource) => ({
    statusCode: 404,
    body: JSON.stringify({ message: `${resource} not found` }),
  }),
  internalError: (error) => ({
    statusCode: 500,
    body: JSON.stringify({ message: "Internal Server Error", error }),
  }),
  badRequest: (field) => ({
    statusCode: 400,
    body: JSON.stringify({ message: `Bad Request: ${field} is required` }),
  }),
  success: (modelType, model) => {
    const resModel = model.toJSON ? model.toJSON() : model;
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success!", [`${modelType}`]: resModel }),
    };
  },
  created: (modelType, model) => {
    const resModel = model.toJSON ? model.toJSON() : model;
    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Created!", [`${modelType}`]: resModel }),
    };
  },
  accepted: {
    statusCode: 202,
    body: JSON.stringify({ message: "Accepted" }),
  },
  unauthorized: (message) => ({
    statusCode: 401,
    body: JSON.stringify({ message }),
  }),
});
export default responses;
