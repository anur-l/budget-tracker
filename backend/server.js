const express = require("express");
require("dotenv").config();
const authRouter = require("./src/route/authRoute");
const budgetRouter = require("./src/route/budgetRoute");
const errorHandler = require("./src/middleware/error");
const cors = require("cors");
const logger  = require("./src/middleware/logger");
const { apiLimiter } = require("./src/middleware/rateLimiter");

const port = process.env.PORT || 5000;

const app = express();

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const log = `${req.method} ${req.url} ${res.statusCode} - ${duration}ms`;

    if (res.statusCode >= 400) {
      logger.error(log, { ip: req.ip });
    } else {
      logger.info(log);
    }
  });

  next();
});

app.use(apiLimiter);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
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
