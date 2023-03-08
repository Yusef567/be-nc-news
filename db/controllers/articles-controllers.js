const { checkTopic } = require("../models/topic-models");
const {
  getAllArticles,
  getArticleWithId,
  updateVotes,
  insertNewArticle,
  removeArticle,
} = require("../models/article-models");

exports.fetchAllArticles = (request, response, next) => {
  const { topic, sort_by, order } = request.query;
  if (topic) {
    const validTopic = checkTopic(topic);
    const articleData = getAllArticles(topic, sort_by, order);
    Promise.all([validTopic, articleData])
      .then((articlesArr) => {
        const articles = articlesArr[1];
        response.status(200).send({ articles });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    getAllArticles(topic, sort_by, order)
      .then((articles) => {
        response.status(200).send({ articles });
      })
      .catch((err) => {
        next(err);
      });
  }
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

exports.patchArticleVotes = (request, response, next) => {
  const { article_id } = request.params;
  const updatedVotes = request.body;
  updateVotes(article_id, updatedVotes)
    .then((updatedArticle) => {
      response.status(201).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticle = (request, response, next) => {
  const newArticle = request.body;
  insertNewArticle(newArticle)
    .then((addedArticle) => {
      response.status(201).send({ addedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteArticle = (request, response, next) => {
  const { article_id } = request.params;
  removeArticle(article_id)
    .then(() => {
      response.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};
