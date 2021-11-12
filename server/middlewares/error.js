const debug = require("debug")("series:errors");
const chalk = require("chalk");
const { ValidationError } = require("express-validation");

const notFoundErrorHandler = (req, res) => {
  res.status(404).json({ error: "Sorry, endpoint not found" });
};

const errorHandler = (error, req, res, next) => {
  debug(chalk.red("An error has occurred: ", error.message));
  if (error instanceof ValidationError) {
    error.code = 400;
    error.message = "Bad request sorry";
  }
  const message = error.code ? error.message : "All broken :(";
  res.status(error.code || 500).json({ error: message });
};
module.exports = { notFoundErrorHandler, errorHandler };
