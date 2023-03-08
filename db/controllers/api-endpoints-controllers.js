const apiEndpoints = require("../../endpoints.json");

exports.fetchApiEndpoint = (request, response, next) => {
  response.status(200).send({ apiEndpoints });
};
