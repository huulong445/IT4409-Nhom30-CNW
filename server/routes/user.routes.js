const express = require("express");
const userController = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/rbac.middleware");
const { ROLES } = require("../config/roles");

const router = express.Router();
router.get("/user/:id", authenticate, userController.getUserById);
router.post("/login", userController.login);
module.exports = router;
router.get(
  "/",
  authenticate,
  requireRole(ROLES.ADMIN),
  userController.getAllUsers,
);

module.exports = router;
