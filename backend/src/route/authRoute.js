const {Router} = require("express")
const auth = require("../controller/authController")
const verify = require("../middleware/auth")
const authRouter = Router();

authRouter.post("/register",auth.register);
authRouter.post("/login",auth.login);

module.exports = authRouter
