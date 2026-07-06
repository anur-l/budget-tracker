const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.port || 5000;

app.get("/", (req, res) => {
  res.json({ message: "budget api is running" });
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
