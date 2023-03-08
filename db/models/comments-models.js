const db = require("../connection");

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

exports.updateCommentVotes = (comment_id, updatedVotes) => {
  const { inc_votes } = updatedVotes;
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`,
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      const updatedComment = rows[0];
      if (!updatedComment) {
        return Promise.reject({
          status: 404,
          msg: "comment_id Not Found",
        });
      }
      return updatedComment;
    });
};
