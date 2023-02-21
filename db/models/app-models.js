const db = require("../connection");

exports.getAllTopics = () => {
  console.log("in the models");
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    console.log(rows, "this is rows");
    return rows;
  });
};

exports.getArticleWithId = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject("article_id not found");
      }
      return article;
    });
};
