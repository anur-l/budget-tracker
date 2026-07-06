const db = require("../config/db");
const queries = require("../database/scripts");

const getbudgetbyId = async (req, res, next) => {
  try {
    const id = req.user.id;
    const results = await db.query(queries.sqlFindUserIdBudget, [id]);
    if (results.rows.length === 0) {
      return res.status(400).json({ msg: "No data currently" });
    }
    const results_budget = await db.query(queries.sqlSumCategory, [id]);
    return res
      .status(200)
      .send({ data: results.rows , summary: results_budget.rows });
  } catch (error) {
    console.error("Internal server error ", error);
    next(error);
  }
};

module.exports = { getbudgetbyId };
