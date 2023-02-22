exports.handlePSQL400s = (error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ msg: "Bad Request" });
  } else if (error.code === "23503") {
    response.status(400).send({ msg: "Bad Request" });
  } else {
    next(error);
  }
};

exports.handleCustomErrors = (error, request, response, next) => {
  if (error === "article_id not found") {
    response.status(404).send({ msg: error });
  } else if (error === "username not found") {
    response.status(404).send({ msg: error });
  } else {
    next(error);
  }
};
exports.hanlde500Errors = (error, request, response, next) => {
  console.log(error);
  response.status(500).send({ msg: "Server Error" });
};
