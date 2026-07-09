const { Router } = require("express");
const auth = require("../controller/authController");
const authRouter = Router();
const { loginLimiter } = require("../middleware/rateLimiter");
authRouter.post("/register", loginLimiter, auth.register);
authRouter.post("/login", loginLimiter, auth.login);

module.exports = authRouter;
