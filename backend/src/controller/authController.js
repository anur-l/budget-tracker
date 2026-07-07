const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authModel = require("../model/authModel");
const validRegister = require("../validators/authValidator");

const register = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    if (!username || !email || !password) {
      const error = new Error("Fill the requirment");
      error.status = 400;
      return next(error);
    }

    username = username.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    const userResult = await authModel.findUser(username);
    if (userResult.length > 0) {
      const error = new Error("User name already exit");
      error.status = 400;
      return next(error);
    }

    const emailResult = await authModel.findEmail(email);
    if (emailResult.length > 0) {
      const error = new Error("Email already exit");
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

    const insertResult = await authModel.insertUser(
      username,
      email,
      passwordHash,
    );

    res.status(201).json({
      success: true,
      user: insertResult,
    });
  } catch (error) {
    console.error("register error", error);
    error.status = 500;
    return next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new Error("Fill the email and password");
    error.status = 400;
    return next(error);
  }

  const userResult = await authModel.findEmail(email.trim().toLowerCase());
  if (userResult.length === 0) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    return next(error);
  }
  const user = userResult[0];
  const verifyPassword = await bcrypt.compare(password, user.password);

  if (!verifyPassword) {
    const error = new Error("Incorrect password, try again");
    error.status = 401;
    return next(error);
  }
  const token = jwt.sign(
    { username: user.username, id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
  );
  res.status(200).json({
    success: true,
    msg: "Login successful",
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
};

module.exports = { register, login };
