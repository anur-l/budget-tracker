const express = require("express");
require("dotenv").config();
const authRouter = require("./src/route/authRoute");
const budgetRouter = require("./src/route/budgetRoute");
const errorHandler = require("./src/middleware/error");
const cors = require("cors");

const port = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/transactions", budgetRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
