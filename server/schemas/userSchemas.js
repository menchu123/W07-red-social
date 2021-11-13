const { Joi } = require("express-validation");

const userLoginRequestSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const userSignUpRequestSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    photo: Joi.string().optional(),
  }),
};

module.exports = { userLoginRequestSchema, userSignUpRequestSchema };
