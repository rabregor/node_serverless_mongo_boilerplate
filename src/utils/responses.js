const responses = Object.freeze({
  forbidden: {
    statusCode: 403,
    body: JSON.stringify({ message: "Forbidden" }),
  },
  notFound: (resource) => ({
    statusCode: 404,
    body: JSON.stringify({ message: `${resource} not found` }),
  }),
  internalError: (error) => ({
    statusCode: 500,
    body: JSON.stringify({ message: "Internal Server Error", error }),
  }),
  badRequest: {
    code: 400,
    body: JSON.stringify({ message: "Bad request" }),
  },
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
