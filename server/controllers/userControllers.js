require("dotenv").config();
const debug = require("debug")("user:controller");
const bcrypt = require("bcrypt");
const chalk = require("chalk");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/user");

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    debug(chalk.redBright("Wrong credentials"));
    const error = new Error("Wrong credentials");
    error.code = 401;
    next(error);
  } else {
    const rightPassword = await bcrypt.compare(password, user.password);
    if (!rightPassword) {
      debug(chalk.redBright("Eeeeek Wrong password"));
      const error = new Error("Eeeeek Wrong password");
      error.code = 401;
      next(error);
    } else {
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
        },
        process.env.SECRET,
        {
          expiresIn: 72 * 60 * 60,
        }
      );
      res.json({ token });
    }
  }
};

const userSignUp = async (req, res, next) => {
  const newUser = req.body;
  const user = await User.findOne({ username: newUser.username });
  if (user) {
    debug(chalk.redBright("Username already taken"));
    const error = new Error("Username already taken");
    error.code = 400;
    next(error);
  } else {
    newUser.friends = [];
    newUser.enemies = [];
    newUser.photo = newUser.photo ? newUser.photo : "";
    newUser.bio = newUser.bio ? newUser.bio : "";
    newUser.password = await bcrypt.hash(newUser.password, 10);
    User.create(newUser);
    res.json(newUser);
  }
};

const getUsers = async (req, res) => {
  debug(chalk.yellowBright("Loading users"));
  const users = await User.find();
  res.json(users);
};

module.exports = { userLogin, userSignUp, getUsers };
