const { Router } = require("express");
const budgetController = require("../controller/budgetController");
const verify = require("../middleware/auth")

const budgetRouther = Router();

budgetRouther.get("/",verify ,budgetController.getBudget);
budgetRouther.post("/",verify,budgetController.addBudget);
budgetRouther.delete("/:id",verify,budgetController.deleteBudget);

module.exports = budgetRouther;
