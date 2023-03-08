const { selectAllUsers, selectUser } = require("../models/users-models");
exports.getAllUsers = (request, response, next) => {
  selectAllUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.fetchUser = (request, response, next) => {
  const { username } = request.params;
  selectUser(username)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
