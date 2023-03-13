const express = require("express");
const app = express();
const cors = require("cors");
const {
  fetchAllArticles,
  fetchArticleWithId,
  patchArticleVotes,
  postArticle,
  deleteArticle,
} = require("./db/controllers/articles-controllers");

const {
  fetchAllTopics,
  postTopic,
} = require("./db/controllers/topics-controllers");

const {
  fetchArticleIdComments,
  addCommentWithId,
  removeCommentWithId,
  patchCommentVotes,
} = require("./db/controllers/comments-controllers");

const {
  getAllUsers,
  fetchUser,
} = require("./db/controllers/users-controllers");

const {
  fetchApiEndpoint,
} = require("./db/controllers/api-endpoints-controllers");

const {
  handlePSQL400s,
  handleCustomErrors,
  hanlde500Errors,
  handlePathNotFound,
} = require("./db/controllers/error-controllers");

app.use(cors());

app.use(express.json());

app.route("/api/articles").get(fetchAllArticles).post(postArticle);

app.route("/api/topics").get(fetchAllTopics).post(postTopic);

app
  .route("/api/articles/:article_id/comments")
  .get(fetchArticleIdComments)
  .post(addCommentWithId);

app
  .route("/api/articles/:article_id")
  .get(fetchArticleWithId)
  .patch(patchArticleVotes)
  .delete(deleteArticle);

app
  .route("/api/comments/:comment_id")
  .patch(patchCommentVotes)
  .delete(removeCommentWithId);

app.get("/api/users", getAllUsers);

app.get("/api", fetchApiEndpoint);

app.get("/api/users/:username", fetchUser);

app.use("/*", handlePathNotFound);

app.use(handlePSQL400s);
app.use(handleCustomErrors);
app.use(hanlde500Errors);

module.exports = app;
