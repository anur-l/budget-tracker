const { Router } = require("express");
const budgetController = require("../controller/budgetController");
const verify = require("../middleware/auth")

const budgetRouther = Router();

budgetRouther.get("/",verify ,budgetController.getbudgetbyId);
budgetRouther.post("/",verify,budgetController.addBudget)

module.exports = budgetRouther;
