const sqlfindUser = "SELECT * FROM users WHERE username = $1";
const sqlfindEmail = "SELECT * FROM users WHERE email = $1";
const sqlInsertUser =
  "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email";

module.exports = { sqlfindUser, sqlInsertUser, sqlfindEmail };
