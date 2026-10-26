const express = require("express");
const controller = require(
  "../../controllers/admin_controller/AdminUser.controller"
);
const { authenticate } = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/rbac.middleware");
const { ROLES } = require("../../config/roles");

const router = express.Router();

router.use(authenticate, requireRole(ROLES.ADMIN));

router.get("/users", controller.getAllUsers);
router.get("/users/:id", controller.getUserById);
router.post("/users", controller.createUser);
router.put("/users/:id", controller.updateUser);
router.patch("/users/:id/status", controller.updateUserStatus);

module.exports = router;