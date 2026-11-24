const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();
const { authenticate } = require("../middlewares/auth.middleware");
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", authenticate, authController.logout);
module.exports = router;
