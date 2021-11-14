const express = require("express");
const { validate } = require("express-validation");
const auth = require("../middlewares/auth");

const {
  userLogin,
  userSignUp,
  getUsers,
  getUserById,
} = require("../controllers/userControllers");
const {
  userLoginRequestSchema,
  userSignUpRequestSchema,
} = require("../schemas/userSchemas");

const router = express.Router();

router.post("/login", validate(userLoginRequestSchema), userLogin);
router.post("/register", validate(userSignUpRequestSchema), userSignUp);
router.get("/", auth, getUsers);
router.get("/:id", auth, getUserById);

module.exports = router;
