const db = require("../connection");

exports.getAllTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.getAllArticles = () => {
  return db
    .query(
      `SELECT CAST(count(*) AS INT)
      AS comment_count,articles.title,articles.topic,articles.author,
      articles.created_at,articles.votes,articles.article_img_url,articles.body,articles.article_id
      FROM comments
      JOIN articles ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
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
exports.getArticleComments = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY comments.created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.postNewComment = (article_id, newComment) => {
  const { username, body } = newComment;
  return db
    .query(
      `INSERT INTO comments (body,author,article_id) VALUES ($1,$2,$3) RETURNING *`,
      [body, username, article_id]
    )
    .then(({ rows }) => {
      const addedComment = rows[0];
      return addedComment;
    });
};

exports.updateVotes = (article_id, updatedVotes) => {
  const { inc_votes } = updatedVotes;
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 
    RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      const updatedArticle = rows[0];
      return updatedArticle;
    });
};
