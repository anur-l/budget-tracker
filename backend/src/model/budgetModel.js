const db = require("../config/db");
const queries = require("../database/scripts");

const findUserIdTransaction = async (id) => {
  const results = await db.query(queries.sqlFindUserIdTransaction, [id]);
  return results.rows;
};

const sumCategory = async (id) => {
  const results = await db.query(queries.sqlSumCategory, [id]);
  return results.rows;
};

const insertTransaction = async (
  id,
  type,
  category,
  amount,
  description,
  date,
) => {
  const results = await db.query(queries.sqlInsertTranscation, [
    id,
    type,
    category,
    amount,
    description,
    date,
  ]);
  return results.rows;
};

const findTransactionId = async (transactionId, id) => {
  const results = await db.query(queries.sqlFindTransactionId, [
    transactionId,
    id,
  ]);
  return results.rows;
};

const deleteTransactionId = async (transactionId, id) => {
  await db.query(queries.sqlDeleteTransaction, [transactionId, id]);
};

const getBudget = async (id) => {
  const results = await db.query(queries.sqlGetBudget, [id]);
  return results.rows;
};

const getCurrentMonthTransactions = async (userId, year, month) => {
  const results = await db.query(queries.sqlGetCurrentMonthTransactions, [
    userId,
    year,
    month,
  ]);
  return results.rows;
};

const getCurrentMonthSummary = async (userId, year, month) => {
  const results = await db.query(queries.sqlGetCurrentMonthSummary, [
    userId,
    year,
    month,
  ]);
  return results.rows;
};

const getCurrentMonthCategories = async (userId, year, month) => {
  const results = await db.query(queries.sqlGetCurrentMonthCategories, [
    userId,
    year,
    month,
  ]);
  return results.rows;
};

module.exports = {
  findUserIdTransaction,
  sumCategory,
  insertTransaction,
  findTransactionId,
  deleteTransactionId,
  getBudget,
  getCurrentMonthTransactions,
  getCurrentMonthSummary,
  getCurrentMonthCategories,
};
