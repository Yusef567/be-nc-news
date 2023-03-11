const db = require("../connection");

exports.getAllArticles = (
  topic,
  sort_by = "created_at",
  order = "desc",
  limit = "10",
  page = "1"
) => {
  let queryStr = `SELECT CAST(count(comments) AS INT)
    AS comment_count,articles.title,articles.topic,articles.author,
    articles.created_at,articles.votes,articles.article_img_url,articles.body,articles.article_id
    FROM comments
    FULL OUTER JOIN articles ON articles.article_id = comments.article_id`;
  let str2 = ` GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}`;
  const queryParams = [];
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
  const isNumber = /^[0-9]{1,}$/;
  const offSet = (page - 1) * limit;

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
  if (topic) {
    queryStr += ` WHERE topic = $1`;
    queryParams.push(topic);
  }
  queryStr += str2;

  if (isNumber.test(limit) && isNumber.test(page)) {
    queryStr += ` LIMIT ${limit} OFFSET ${offSet}`;
  } else if (!isNumber.test(limit)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid limit query",
    });
  } else if (!isNumber.test(page)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid page query",
    });
  }
  return db.query(queryStr, queryParams).then(({ rows }) => {
    return rows;
  });
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
      return Promise.reject({
        status: 404,
        msg: "article_id not found",
      });
    }
    return article;
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

exports.insertNewArticle = (newArticle) => {
  const { author, title, body, topic, article_img_url } = newArticle;
  return db
    .query(
      "INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [author, title, body, topic, article_img_url]
    )
    .then(({ rows }) => {
      const newArticleId = rows[0].article_id;
      return newArticleId;
    })
    .then((newArticleId) => {
      const commentCountQuery = `SELECT CAST(count(comments) AS INT)
      AS comment_count,articles.title,articles.topic,articles.author,
      articles.created_at,articles.votes,articles.article_img_url,articles.body,articles.article_id
      FROM comments
      FULL OUTER JOIN articles ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`;
      return db.query(commentCountQuery, [newArticleId]).then(({ rows }) => {
        const addedArticle = rows[0];
        return addedArticle;
      });
    });
};

exports.removeArticle = (article_id) => {
  const removeComments = `DELETE FROM comments
  WHERE article_id = $1
   RETURNING *;`;
  const removeArticle = `
  DELETE FROM articles 
  WHERE article_id = $1
  RETURNING *;`;

  return db
    .query(removeComments, [article_id])
    .then(() => {})
    .then(() => {
      return db.query(removeArticle, [article_id]).then(({ rows }) => {
        const deletedArticle = rows[0];
        if (!deletedArticle) {
          return Promise.reject({
            status: 404,
            msg: "article_id Not Found",
          });
        }
        return deletedArticle;
      });
    });
};
