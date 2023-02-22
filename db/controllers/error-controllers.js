exports.handlePSQL400s = (error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ msg: "Bad Request" });
  } else if (error.code === "23502") {
    console.log(error.code);
    console.log("hi in the psql error");
    response.status(400).send({ msg: "Bad Request" });
  } else if (error.code === "23503") {
    response.status(404).send({ msg: "Not Found" });
  } else {
    next(error);
  }
};

exports.handleCustomErrors = (error, request, response, next) => {
  if (error === "article_id not found") {
    response.status(404).send({ msg: error });
  } else {
    next(error);
  }
};

exports.hanlde500Errors = (error, request, response, next) => {
  console.log(error);
  response.status(500).send({ msg: "Server Error" });
};
