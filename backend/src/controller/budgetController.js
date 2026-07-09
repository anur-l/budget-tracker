const validBudget = require("../validators/budgetValidator");
const budgetModel = require("../model/budgetModel.js");
const logger = require("../middleware/logger");

const getBudget = async (req, res, next) => {
  try {
    const id = req.user.id;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const [monthTransactions, monthSummary, monthCategories] =
      await Promise.all([
        budgetModel.getCurrentMonthTransactions(id, currentYear, currentMonth),
        budgetModel.getCurrentMonthSummary(id, currentYear, currentMonth),
        budgetModel.getCurrentMonthCategories(id, currentYear, currentMonth),
      ]);
    if (monthTransactions.length === 0) {
      logger.info(
        `Budget fetch: No transactions for ${currentYear}-${currentMonth}`,
      );
      return res.status(200).json({ msg: "No data currently" });
    }

    logger.info(`Budget fetch: Loaded data for user ${id}`);
    return res.status(200).json({
        data: monthTransactions,
        category: monthCategories,
        summary: monthSummary[0] || {
          total_income: 0,
          total_expense: 0,
          net_balance: 0,
        },
    });
  } catch (error) {
    logger.error(`Budget GET catch: ${error.message}`);
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
    logger.info(`Budget add: User ${id} created ${type} entry (${category})`);

    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    logger.error(`Budget POST catch: ${error.message}`);
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
      logger.warn(
        `Budget delete failed: Tx ${transactionId} not found for user ${id}`,
      );
      const error = new Error("Transaction not found");
      error.status = 404;
      return next(error);
    }
    await budgetModel.deleteTransactionId(transactionId, id);
    logger.info(`Budget delete: User ${id} removed tx ${transactionId}`);
    res.status(200).json({ success: true, msg: "Successfully deleted" });
  } catch (error) {
    logger.error(`Budget DELETE catch: ${error.message}`);
    console.error("DELETE error: ", error);
    next(error);
  }
};


const updateBudget = async (req, res, next) => {
  try {
    const transactionId = parseInt(req.params.id);
    const id = req.user.id;
    const { type, category, amount, description, date } = req.body;

    const exists = await budgetModel.findTransactionId(transactionId, id);
    if (exists.length === 0) {
      logger.warn(
        `Update failed: Tx ${transactionId} not found for user ${id}`,
      );
      const error = new Error("Transaction not found");
      error.status = 404;
      return next(error);
    }

    const checkValid = validBudget(type, category, amount, date, true);
    if (!checkValid.success) {
      const error = new Error(checkValid.msg);
      error.status = 400;
      return next(error);
    }

    const updates = [];
    const values = [];
    let index = 1;

    if (type) {
      updates.push(`type = $${index++}`);
      values.push(type);
    }
    if (category) {
      updates.push(`category = $${index++}`);
      values.push(category);
    }
    if (amount) {
      const num = parseFloat(amount);
      if (isNaN(num) || num <= 0) {
        const error = new Error("Amount must be a valid positive number");
        error.status = 400;
        return next(error);
      }
      updates.push(`amount = $${index++}`);
      values.push(num);
    }
    if (description !== undefined) {
      updates.push(`description = $${index++}`);
      values.push(description);
    }
    if (date) {
      updates.push(`date = $${index++}`);
      values.push(date);
    }

    if (updates.length === 0) {
      const error = new Error("No fields to update");
      error.status = 400;
      return next(error);
    }

    const idIndex = index++;
    const userIndex = index++;
    values.push(transactionId, id);
    const query = `
      UPDATE transactions 
      SET ${updates.join(", ")} 
      WHERE id = $${idIndex} AND user_id = $${userIndex}
      RETURNING *
    `;

    const db = require("../config/db");
    const result = await db.query(query, values);

    logger.info(`Budget update: User ${id} updated tx ${transactionId}`);

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    logger.error(`Budget UPDATE error: ${error.message}`);
    next(error);
  }
};

const getAllMonthsSummary = async (req, res, next) => {
  try {
    const id = req.user.id;
    console.log("📊 Getting monthly summary for user:", id); // ← Debug
    
    // Get all transactions for this user
    const transactions = await budgetModel.findUserIdTransaction(id);
    console.log("📊 Found transactions:", transactions.length); // ← Debug
    
    if (transactions.length === 0) {
      return res.status(200).json({ 
        msg: "No data available",
        months: [] 
      });
    }
    
    // Group by month
    const monthlyData = {};
    transactions.forEach(t => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[key]) {
        monthlyData[key] = {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          total_income: 0,
          total_expense: 0,
          net_balance: 0,
          transaction_count: 0
        };
      }
      
      const amount = parseFloat(t.amount);
      if (t.type === 'income') {
        monthlyData[key].total_income += amount;
      } else {
        monthlyData[key].total_expense += amount;
      }
      monthlyData[key].net_balance = monthlyData[key].total_income - monthlyData[key].total_expense;
      monthlyData[key].transaction_count++;
    });
    
    // Convert to array and sort by date (newest first)
    const months = Object.values(monthlyData).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
    
    console.log("📊 Monthly summary:", months.length, "months"); // ← Debug
    
    return res.status(200).json({
      success: true,
      months: months
    });
    
  } catch (error) {
    console.error("❌ Monthly summary error:", error); // ← Debug
    logger.error(`Monthly summary error: ${error.message}`);
    next(error);
  }
};

const getMonthTransactions = async (req, res, next) => {
  try {
    const id = req.user.id;
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    
    console.log("📊 Getting month data:", { userId: id, year, month }); // ← Debug
    
    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      const error = new Error("Invalid year or month");
      error.status = 400;
      return next(error);
    }
    
    const [transactions, summary, categories] = await Promise.all([
      budgetModel.getCurrentMonthTransactions(id, year, month),
      budgetModel.getCurrentMonthSummary(id, year, month),
      budgetModel.getCurrentMonthCategories(id, year, month),
    ]);
    
    console.log("📊 Month data found:", transactions.length, "transactions"); // ← Debug
    
    return res.status(200).json({
      year,
      month,
      data: transactions,
      category: categories,
      summary: summary[0] || {
        total_income: 0,
        total_expense: 0,
        net_balance: 0
      }
    });
    
  } catch (error) {
    console.error("❌ Month transactions error:", error); // ← Debug
    logger.error(`Month transactions error: ${error.message}`);
    next(error);
  }
};

// ✅ UPDATE EXPORTS
module.exports = { 
  getBudget, 
  getAllMonthsSummary,   // ← MUST be here!
  getMonthTransactions,  // ← MUST be here!
  addBudget, 
  updateBudget, 
  deleteBudget 
};
// module.exports = { getBudget, addBudget, updateBudget, deleteBudget };
