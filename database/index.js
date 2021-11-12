const debug = require("debug")("social:database");
const chalk = require("chalk");
const mongoose = require("mongoose");

const initializeDB = (connectionString) =>
  new Promise((resolve, reject) => {
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        // eslint-disable-next-line no-underscore-dangle
        delete ret._id;
        // eslint-disable-next-line no-underscore-dangle
        delete ret.__v;
      },
    });

    mongoose.connect(connectionString, (error) => {
      if (error) {
        debug(chalk.red("Could not connect to database"));
        debug(chalk.red(error.message));
        reject(error);
      }
      debug(chalk.green("Connection to database successful"));
      resolve();
    });

    mongoose.connection.on("close", () => {
      debug(chalk.green("Connection to database OVER"));
    });
  });

module.exports = initializeDB;
