const db = require("../config/db");
const queries = require("../database/scripts");

const findUser = async (username) => {
  const result = await db.query(queries.sqlFindUser, [username]);
  return result.rows;
};

const findEmail = async (email) => {
  const result = await db.query(queries.sqlFindEmail, [email]);
  return result.rows;
};

const insertUser = async (username, email, passwordHash) => {
  const result = await db.query(queries.sqlInsertUser, [
    username,
    email,
    passwordHash,
  ]);
  return result.rows[0];
};

module.exports = { findUser, findEmail, insertUser };
