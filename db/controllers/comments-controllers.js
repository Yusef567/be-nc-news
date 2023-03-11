const { getArticleWithId } = require("../models/article-models");
const {
  getArticleComments,
  postNewComment,
  deleteComment,
  updateCommentVotes,
} = require("../models/comments-models");
exports.fetchArticleIdComments = (request, response, next) => {
  const { article_id } = request.params;
  const { limit, page } = request.query;
  const checkArticle = getArticleWithId(article_id);
  const getComments = getArticleComments(article_id, limit, page);
  Promise.all([checkArticle, getComments])
    .then((commentsArr) => {
      const comments = commentsArr[1];
      response.status(200).send({ comments });
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

exports.patchCommentVotes = (request, response, next) => {
  const { comment_id } = request.params;
  const updatedVotes = request.body;
  updateCommentVotes(comment_id, updatedVotes)
    .then((updatedComment) => {
      response.status(201).send({ updatedComment });
    })
    .catch((err) => {
      next(err);
    });
};
