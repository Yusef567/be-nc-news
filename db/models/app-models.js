const db = require("../connection");

exports.getAllTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.getAllArticles = (topic, sort_by = "created_at", order = "desc") => {
  let queryStr = `SELECT CAST(count(comments) AS INT)
  AS comment_count,articles.title,articles.topic,articles.author,
  articles.created_at,articles.votes,articles.article_img_url,articles.body,articles.article_id
  FROM comments
  FULL OUTER JOIN articles ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order}`;
  const validSortBy = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_img_url",
  ];
  const validOrderBy = ["desc", "asc"];
  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: "Column not found",
    });
  } else if (!validOrderBy.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid order query",
    });
  }
  if (!topic) {
    return db.query(queryStr).then(({ rows }) => {
      return rows;
    });
  } else if (topic) {
    let topicStr = `SELECT CAST(count(comments) AS INT)
    AS comment_count,articles.title,articles.topic,articles.author,
    articles.created_at,articles.votes,articles.article_img_url,articles.body,articles.article_id
    FROM comments
    FULL OUTER JOIN articles ON articles.article_id = comments.article_id
    WHERE topic = $1
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};`;
    return db.query(topicStr, [topic]).then(({ rows }) => {
      return rows;
    });
  }
};

exports.getArticleWithId = (article_id) => {
  let queryStr = `SELECT CAST(count(comments) AS INT)
  AS comment_count,articles.title,articles.topic,articles.author,
  articles.created_at,articles.votes,articles.article_img_url,articles.body,articles.article_id
  FROM comments
  FULL OUTER JOIN articles ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id
   ORDER BY created_at desc;`;

  return db.query(queryStr, [article_id]).then(({ rows }) => {
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
      if (!updatedArticle) {
        return Promise.reject({
          status: 404,
          msg: "article_id not found",
        });
      } else {
        return updatedArticle;
      }
    });
};

exports.selectAllUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
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
          msg: "Not found",
        });
      }
      return topicFound;
    });
};

exports.deleteComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then(({ rows }) => {
      const deletedComment = rows[0];
      if (!deletedComment) {
        return Promise.reject({
          status: 404,
          msg: "Comment_id Not Found",
        });
      }
      return deletedComment;
    });
};
