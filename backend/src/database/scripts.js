const sqlfindUser = "SELECT * FROM users WHERE username = $1";
const sqlfindEmail = "SELECT * FROM users WHERE email = $1";
const sqlInsertUser =
  "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email";

const sqlFindUserIdBudget = "SELECT * FROM transactions where user_id = $1";
const sqlSumCategory =
  "SELECT category, SUM(amount) as total FROM transactions WHERE user_id = $1 GROUP BY category order by total DESC;";

const sqlInsertTranscation =
  "INSERT INTO transactions (user_id, type, category, amount, description, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id, amount ,category";


module.exports = {
  sqlfindUser,
  sqlInsertUser,
  sqlfindEmail,
  sqlFindUserIdBudget,
  sqlSumCategory,
  sqlInsertTranscation
};
