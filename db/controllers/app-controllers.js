const { getAllTopics, getArticleWithId } = require("../models/app-models");
const express = require("express");

exports.fetchAllTopics = (request, response, next) => {
  console.log("in the controller");
  getAllTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      console.log(err, "this is an error");
    });
};

exports.fetchArticleWithId = (request, response, next) => {
  const { article_id } = request.params;
  getArticleWithId(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
