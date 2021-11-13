const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    const error = new Error("Not authorized sorry");
    error.code = 401;
    next(error);
  } else {
    const token = authHeader.split(" ")[1];

    if (!token) {
      const error = new Error("Token is missing...");
      error.code = 401;
      next(error);
    } else {
      try {
        const { id, username, admin } = jwt.verify(token, process.env.SECRET);
        req.userInfo = { id, username, admin };
        next();
      } catch (error) {
        error.message = "Token no valid";
        error.code = 401;
        next(error);
      }
    }
  }
};

module.exports = auth;
