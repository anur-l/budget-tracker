const bcrypt = require("bcryptjs");
const db = require("../config/db");

const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send("Fille the requirment");
  }

  const result = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

  if (result.rows.length > 0) {
    return res.status(400).send("User already exit");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const insertResult = await db.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
    [username, email, passwordHash],
  );
  res.json({
    success: true,
    user: insertResult.rows[0],
  });
};

module.exports = { register };
