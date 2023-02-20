const { getAllTopics } = require("../models/app-models");
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
