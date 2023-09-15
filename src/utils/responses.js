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
    code: 400,
    body: JSON.stringify({ message: `Bad Request: ${field} is required` }),
  }),
  success: (modelType, model) => ({
    code: 200,
    body: JSON.stringify({ message: "Success!", [`${modelType}`]: model }),
  }),
  created: (modelType, model) => ({
    code: 201,
    body: JSON.stringify({ message: "Created!", [`${modelType}`]: model }),
  }),
  accepted: {
    code: 202,
    body: JSON.stringify({ message: "Accepted" }),
  },
});
export default responses;
