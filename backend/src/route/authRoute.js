const bcrypt = require("bcryptjs")
const {Router} = require("express")
const auth = require("../controller/authController")
const authRouter = Router();

authRouter.post("/register",auth.register);

module.exports = authRouter
