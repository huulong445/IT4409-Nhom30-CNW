const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// GET /api/v1/users
const { verifyToken } = require("../middleware/auth.middleware");
// test
console.log(typeof verifyToken);
console.log(typeof userController.getAllUsers);
console.log(typeof userController.getUserById);
console.log(typeof userController.login);

router.get("/", verifyToken, userController.getAllUsers);
router.get("/user/:id", verifyToken, userController.getUserById);
router.post("/login", userController.login);
module.exports = router;
