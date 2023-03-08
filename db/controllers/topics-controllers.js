const { getAllTopics, insertTopic } = require("../models/topic-models");
exports.fetchAllTopics = (request, response, next) => {
  getAllTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postTopic = (request, response, next) => {
  const newTopic = request.body;
  insertTopic(newTopic)
    .then((addedTopic) => {
      response.status(201).send({ addedTopic });
    })
    .catch((err) => {
      next(err);
    });
};
