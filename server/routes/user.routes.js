const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// GET /api/v1/users
router.get("/", userController.getAllUsers);

module.exports = router;
