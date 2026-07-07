const db = require("../config/db");
const queries = require("../database/scripts");

const getBudget = async (req, res, next) => {
  try {
    const id = req.user.id;
    const results = await db.query(queries.sqlFindUserIdTransaction, [id]);

    if (results.rows.length === 0) {
      return res.status(200).json({ msg: "No data currently" });
    }

    const results_budget = await db.query(queries.sqlSumCategory, [id]);

    return res
      .status(200)
      .json({ data: results.rows, summary: results_budget.rows });
  } catch (error) {
    console.error("GET error: ", error);
    next(error);
  }
};

const addBudget = async (req, res, next) => {
  try {
    const id = req.user.id;
    const { type, category, amount, description, date } = req.body;
    if (!type || !category || !amount || !date) {
      const error = new Error("Fill all the requirment");
      error.status = 400;
      return next(error);
    }
    if (type !== "income" && type !== "expense") {
      const error = new Error("It should be expense or income");
      error.status = 400;
      return next(error);
    }
    if (category.length < 3 || category.length > 20) {
      const error = new Error("Enter the correct format");
      error.status = 400;
      return next(error);
    }
    if (!parseFloat(amount)) {
      const error = new Error("It must be integer or float");
      error.status = 400;
      return next(error);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const error = new Error("Correct should be format YYYY-MM-DD");
      error.status = 400;
      return next(error);
    }
    const dateint = date.replace(/-/g, "");
    let year = dateint.slice(0, 4);
    let month = dateint.slice(4, 6);
    let day = dateint.slice(6);
    year = parseInt(year);
    month = parseInt(month);
    day = parseInt(day);
    const currentYear = new Date().getFullYear();
    if (
      year < 2020 ||
      year > currentYear ||
      month < 0 ||
      month > 12 ||
      day < 1 ||
      day > 31
    ) {
      const error = new Error("Correct should be format YYYY-MM-DD");
      error.status = 400;
      return next(error);
    }

    const results = await db.query(queries.sqlInsertTranscation, [
      id,
      type,
      category,
      amount,
      description,
      date,
    ]);

    return res.status(201).json({ success: true, data: results.rows });
  } catch (error) {
    console.error("POST error: ", error);
    next(error);
  }
};

const deleteBudget = async (req, res, next) => {
  try {
    const transactionId = parseInt(req.params.id);
    const id = req.user.id;

    if (isNaN(transactionId) || transactionId <= 0) {
      const error = new Error("Invalid transaction ID");
      error.status = 400;
      return next(error);
    }
    const checkId = await db.query(queries.sqlFindTransactionId, [
      transactionId,
      id,
    ]);

    if (checkId.rows.length === 0) {
      const error = new Error("Transaction not found");
      error.status = 404;
      return next(error);
    }
    await db.query(queries.sqlDeleteTransaction, [transactionId, id]);

    res
      .status(200)
      .json({ success: "Successfully deleted", data: checkId.rows });
  } catch (error) {
    console.error("DELETE error: ", error);
    next(error);
  }
};
module.exports = { getBudget, addBudget, deleteBudget };
