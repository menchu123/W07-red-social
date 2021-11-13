const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  enemies: {
    type: [Types.ObjectId],
    ref: "Users",
    required: true,
  },
  friends: {
    type: [Types.ObjectId],
    ref: "Users",
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
});

const User = model("User", userSchema, "users");

module.exports = User;
