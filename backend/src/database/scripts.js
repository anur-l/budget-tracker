// Auth

const sqlFindUser = "SELECT * FROM users WHERE username = $1";
const sqlFindEmail = "SELECT * FROM users WHERE email = $1";
const sqlInsertUser =
  "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email";

//Budget

const sqlFindUserIdTransaction =
  "SELECT * FROM transactions where user_id = $1";
const sqlSumCategory =
  "SELECT category, SUM(amount) as total FROM transactions WHERE user_id = $1 AND type != 'income' GROUP BY category ORDER BY total DESC;";
const sqlInsertTranscation = `
    INSERT INTO transactions
   (user_id, type, category, amount, description, date) 
   VALUES ($1, $2, $3, $4, $5, $6)
   RETURNING user_id, amount ,category;`;
const sqlDeleteTransaction =
  "DELETE FROM transactions WHERE id = $1 AND user_id = $2";
const sqlFindTransactionId =
  "SELECT * FROM transactions WHERE id = $1 AND user_id = $2";
const sqlGetBudget = `
  SELECT 
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
    COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense,
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) AS net_balance
  FROM transactions 
  WHERE user_id = $1
`;

const sqlGetCurrentMonthTransactions = `
  SELECT * FROM transactions 
  WHERE user_id = $1 
  AND EXTRACT(YEAR FROM date) = $2
  AND EXTRACT(MONTH FROM date) = $3
  ORDER BY date DESC
`;

const sqlGetCurrentMonthSummary = `
  SELECT 
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
    COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense,
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as net_balance
  FROM transactions
  WHERE user_id = $1 
  AND EXTRACT(YEAR FROM date) = $2
  AND EXTRACT(MONTH FROM date) = $3
`;

const sqlGetCurrentMonthCategories = `
  SELECT category, SUM(amount) as total 
  FROM transactions 
  WHERE user_id = $1 
  AND type != 'income'
  AND EXTRACT(YEAR FROM date) = $2
  AND EXTRACT(MONTH FROM date) = $3
  GROUP BY category 
  ORDER BY total DESC
`;
module.exports = {
  sqlFindUser,
  sqlInsertUser,
  sqlFindEmail,
  sqlFindUserIdTransaction,
  sqlSumCategory,
  sqlInsertTranscation,
  sqlDeleteTransaction,
  sqlFindTransactionId,
  sqlGetBudget,
  sqlGetCurrentMonthTransactions,
  sqlGetCurrentMonthSummary,
  sqlGetCurrentMonthCategories,
};
