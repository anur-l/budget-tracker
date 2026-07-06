const bcrypt = require("bcryptjs");
const db = require("../config/db");
const queries = require("../database/scripts");
function validRegister(username, email, password) {
  if (username.length < 3 || username.length > 30)
    return { success: false, msg: "username must be between 3 and 30" };

  if (password.length < 8)
    return { success: false, msg: "password must alleast 8 character" };

  if (!/[a-zA-Z]/.test(password))
    return { success: false, msg: "password must have atleast one letter" };

  if (!/\d/.test(password))
    return { success: false, msg: "password must have atleast one number" };

  if (!/[^a-zA-Z0-9]/.test(password))
    return {
      success: false,
      msg: "password must have atleast one special character",
    };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { success: false, msg: "Invalied email, try again" };

  return { success: true, msg: "pass vaildation" };
}

const register = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    if (!username || !email || !password) {
      const error = new Error("Fille the requirment");
      error.status = 400;
      return next(error);
    }

    username = username.trim();
    email = email.trim();
    password = password.trim();
    const userResult = await db.query(queries.sqlfindUser, [username]);

    if (userResult.rows.length > 0) {
      const error = new Error("User name already exit");
      error.status = 400;
      return next(error);
    }

    const emailResult = await db.query(queries.sqlfindEmail, [email]);

    if (emailResult.rows.length > 0) {
      const error = new Error("Email name already exit");
      error.status = 400;
      return next(error);
    }
    const checkRegister = validRegister(username, email, password);
    if (!checkRegister.success) {
      const error = new Error(checkRegister.msg);
      error.status = 400;
      return next(error);
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const insertResult = await db.query(queries.sqlInsertUser, [
      username,
      email,
      passwordHash,
    ]);
    res.status(201).json({
      success: true,
      user: insertResult.rows[0],
    });
  } catch (error) {
      console.error("register error", error);
      error.status = 500;
      return next(error);
  }
};

module.exports = { register };
