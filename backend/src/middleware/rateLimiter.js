const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 7,
  standardHeaders: true, 
  legacyHeaders: false,
  message: {
    success: false,
    msg: "Too many login attempts..., try in 15 minute later",
  },
});

const budgetLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    msg: "Too many transactions, do it slowly",

  },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    msg: "Too many requests. Please try again later.",
  },
});

module.exports = { loginLimiter, budgetLimiter, apiLimiter };
