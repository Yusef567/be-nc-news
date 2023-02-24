const {
  getAllTopics,
  getAllArticles,
  getArticleWithId,
  getArticleComments,
  postNewComment,
  updateVotes,
  selectAllUsers,
  checkTopic,
  deleteComment,
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
exports.fetchArticleIdComments = (request, response, next) => {
  const { article_id } = request.params;
  const checkArticle = getArticleWithId(article_id);
  const getComments = getArticleComments(article_id);
  Promise.all([checkArticle, getComments])
    .then((commentsArr) => {
      const foundComment = commentsArr[1];
      response.status(200).send({ comments: foundComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.addCommentWithId = (request, response, next) => {
  const { article_id } = request.params;
  const newComment = request.body;
  const checkArticle = getArticleWithId(article_id);
  const addComment = postNewComment(article_id, newComment);
  Promise.all([checkArticle, addComment])
    .then((commentArr) => {
      const comment = commentArr[1];
      response.status(201).send({ comment });
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

exports.getAllUsers = (request, response, next) => {
  selectAllUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.removeCommentWithId = (request, response, next) => {
  const { comment_id } = request.params;
  deleteComment(comment_id)
    .then(() => {
      response.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};
