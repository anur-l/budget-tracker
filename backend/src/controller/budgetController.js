const validBudget = require("../validators/budgetValidator");
const budgetModel = require("../model/budgetModel.js");

const getBudget = async (req, res, next) => {
  try {
    const id = req.user.id;

    const results = await budgetModel.findUserIdTransaction(id);
    if (results.length === 0) {
      return res.status(200).json({ msg: "No data currently" });
    }

    const results_budget = await budgetModel.sumCategory(id);

    return res.status(200).json({ data: results, summary: results_budget });
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

    const checkValid = validBudget(type, category, amount, date);
    if (!checkValid.success) {
      const error = new Error(checkValid.msg);
      error.status = 400;
      return next(error);
    }
    const result = await budgetModel.insertTransaction(
      id,
      type,
      category,
      amount,
      description,
      date,
    );

    return res.status(201).json({ success: true, data: result });
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

    const result = await budgetModel.findTransactionId(transactionId, id);

    if (result.length === 0) {
      const error = new Error("Transaction not found");
      error.status = 404;
      return next(error);
    }
    await budgetModel.deleteTransactionId(transactionId, id);

    res.status(200).json({ success: true, msg: "Successfully deleted" });
  } catch (error) {
    console.error("DELETE error: ", error);
    next(error);
  }
};
module.exports = { getBudget, addBudget, deleteBudget };
