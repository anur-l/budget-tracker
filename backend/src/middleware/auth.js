const jwt = require("jsonwebtoken");

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    const error = new Error("NOT authorization");
    error.status = 401;
    return next(error);
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      const error = new Error(" Invalid or expired token");
      error.status = 403;
      return next(error);
    }
    req.user = decoded;
    next();
  });
};

module.exports = verify;
