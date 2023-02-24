const express = require("express");
const app = express();
const {
  fetchAllTopics,
  fetchAllArticles,
  fetchArticleWithId,
  fetchArticleIdComments,
  addCommentWithId,
  patchArticleVotes,
  getAllUsers,
  removeCommentWithId,
} = require("./db/controllers/app-controllers");

const {
  handlePSQL400s,
  handleCustomErrors,
  hanlde500Errors,
} = require("./db/controllers/error-controllers");
app.use(express.json());

app.get("/api/topics", fetchAllTopics);

app.get("/api/articles", fetchAllArticles);

app.get("/api/articles/:article_id", fetchArticleWithId);

app.get("/api/articles/:article_id/comments", fetchArticleIdComments);

app.post("/api/articles/:article_id/comments", addCommentWithId);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.get("/api/users", getAllUsers);

app.delete("/api/comments/:comment_id", removeCommentWithId);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handlePSQL400s);
app.use(handleCustomErrors);
app.use(hanlde500Errors);
module.exports = app;
