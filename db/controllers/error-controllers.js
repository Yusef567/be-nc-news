exports.handlePSQL400s = (error, request, response, next) => {
  if (
    error.code === "22P02" ||
    error.code === "23502" ||
    error.code === "23505"
  ) {
    response.status(400).send({ msg: "Bad Request" });
  } else if (error.code === "23503") {
    response.status(404).send({ msg: "Not Found" });
  } else {
    next(error);
  }
};

exports.handleCustomErrors = (error, request, response, next) => {
  if (error.status && error.msg) {
    response.status(error.status).send({ msg: error.msg });
  } else {
    next(error);
  }
};

exports.hanlde500Errors = (error, request, response, next) => {
  console.log(error);
  response.status(500).send({ msg: "Server Error" });
};

exports.handlePathNotFound = (request, response) => {
  response.status(404).send({ msg: "Path not found" });
};
