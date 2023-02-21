const express = require("express");
const app = express();
const {
  fetchAllTopics,
  fetchArticleWithId,
} = require("./db/controllers/app-controllers");

app.get("/api/topics", fetchAllTopics);

app.get("/api/articles/:article_id", fetchArticleWithId);
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "page not found" });
});
module.exports = app;
