const express = require("express");
const app = express();
const {
  fetchAllTopics,
  fetchAllArticles,
} = require("./db/controllers/app-controllers");

app.get("/api/topics", fetchAllTopics);

app.get("/api/articles", fetchAllArticles);

app.use("/*", (request, response) => {
  response.status(404).send({ msg: "Path not found" });
});
module.exports = app;
