const responses = Object.freeze({
  forbidden: {
    code: 403,
    body: JSON.stringify({ message: "Forbidden" }),
  },
  notFound: {
    code: 404,
    body: JSON.stringify({ message: "Not found" }),
  },
  internalServerError: {
    code: 500,
    body: JSON.stringify({ message: "Internal server error" }),
  },
  badRequest: {
    code: 400,
    body: JSON.stringify({ message: "Bad request" }),
  },
  ok: {
    code: 200,
    body: JSON.stringify({ message: "OK" }),
  },
  created: {
    code: 201,
    body: JSON.stringify({ message: "Created" }),
  },
  accepted: {
    code: 202,
    body: JSON.stringify({ message: "Accepted" }),
  },
});
export default responses;
