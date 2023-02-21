const {
  getAllTopics,
  getAllArticles,
  getArticleWithId,
  getArticleComments,
  selectCommentById,
} = require("../models/app-models");

exports.fetchAllTopics = (request, response, next) => {
  getAllTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.fetchAllArticles = (request, response, next) => {
  getAllArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
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

exports.fetchArticleIdComments = (request, response, next) => {
  const { article_id } = request.params;
  const checkArticle = getArticleWithId(article_id);
  const getComments = getArticleComments(article_id);
  Promise.all([checkArticle, getComments])
    .then((commentsArr) => {
      const foundComments = commentsArr[1];
      response.status(200).send({ comments: foundComments });
    })
    .catch((err) => {
      next(err);
    });
};
