const express = require("express");
const app = express();
const { fetchAllTopics } = require("./db/controllers/app-controllers");

app.get("/api/topics", fetchAllTopics);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "page not found" });
});
module.exports = app;
