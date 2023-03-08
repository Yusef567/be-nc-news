const db = require("../connection");

exports.getAllTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.checkTopic = (slug) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1;`, [slug])
    .then(({ rows }) => {
      const topicFound = rows[0];
      if (!topicFound) {
        return Promise.reject({
          status: 404,
          msg: "Topic Not Found",
        });
      }
      return topicFound;
    });
};

exports.insertTopic = (newTopic) => {
  const { slug, description } = newTopic;
  return db
    .query(`INSERT INTO topics (slug,description) VALUES ($1,$2) RETURNING *`, [
      slug,
      description,
    ])
    .then(({ rows }) => {
      const addedTopic = rows[0];
      return addedTopic;
    });
};
