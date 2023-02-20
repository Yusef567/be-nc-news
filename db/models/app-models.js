const db = require("../connection");

exports.getAllTopics = () => {
  console.log("in the models");
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    console.log(rows, "this is rows");
    return rows;
  });
};
