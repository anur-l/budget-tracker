const express = require("express");
require("dotenv").config();
const authRouter = require("./src/route/authRoute")
const errorHandler = require("./src/middleware/error")

const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use("/",authRouter)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
