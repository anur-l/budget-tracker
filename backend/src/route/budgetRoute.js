const { Router } = require("express");
const budgetController = require("../controller/budgetController");
const verify = require("../middleware/auth")

const budgetRouther = Router();

budgetRouther.get("/",verify ,budgetController.getbudgetbyId);

module.exports = budgetRouther;
