const { Router } = require("express");
const budgetController = require("../controller/budgetController");
const verify = require("../middleware/auth");
const { budgetLimiter } = require("../middleware/rateLimiter");

const budgetRouther = Router();

budgetRouther.get("/", verify, budgetController.getBudget);
budgetRouther.post("/", verify, budgetLimiter, budgetController.addBudget);
budgetRouther.delete("/:id", verify, budgetController.deleteBudget);
budgetRouther.patch("/:id", verify, budgetController.updateBudget);
budgetRouther.get("/months", verify, budgetController.getAllMonthsSummary); // ← MUST EXIST!
budgetRouther.get("/month/:year/:month", verify, budgetController.getMonthTransactions);
module.exports = budgetRouther;
