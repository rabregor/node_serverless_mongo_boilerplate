const responses = Object.freeze({
  forbidden: (action) => ({
    statusCode: 403,
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify({ message: `Forbidden: ${action}` }),
  }),
  notFound: (resource) => ({
    statusCode: 404,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({ message: `${resource} not found` }),
  }),
  internalError: (error) => ({
    statusCode: 500,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({ message: "Internal Server Error", error }),
  }),
  badRequest: (field) => ({
    statusCode: 400,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({ message: `Bad Request: ${field} is required` }),
  }),
  success: (modelType, model) => {
    const resModel = model.toJSON ? model.toJSON() : model;
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "Success!", [`${modelType}`]: resModel }),
    };
  },
  created: (modelType, model, args = {}) => {
    const resModel = model.toJSON ? model.toJSON() : model;
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "Created!",
        [`${modelType}`]: resModel,
        ...args,
      }),
    };
  },
  accepted: {
    statusCode: 202,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({ message: "Accepted" }),
  },
  unauthorized: (message) => ({
    statusCode: 401,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({ message }),
  }),
});
export default responses;
