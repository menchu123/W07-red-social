const express = require("express");

const { userLogin, userSignUp } = require("../controllers/userControllers");

const router = express.Router();

router.post("/login", userLogin);
router.post("/register", userSignUp);

module.exports = router;
