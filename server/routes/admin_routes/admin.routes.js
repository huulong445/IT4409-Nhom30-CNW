const express = require("express");
const controller = require(
  "../../controllers/admin_controller/AdminUser.controller"
);
const { authenticate } = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/rbac.middleware");
const { ROLES } = require("../../config/roles");

const router = express.Router();
const departmentController = require("../../controllers/admin_controller/AdminDepartment.controller");
const staffController = require("../../controllers/admin_controller/AdminStaff.controller");
router.use(authenticate, requireRole(ROLES.ADMIN));


//Quan ly nhan vien
router.get("/staff", staffController.getAllStaff);
router.get("/staff/:id", staffController.getStaffById);
router.post("/staff", staffController.createStaff);
router.put("/staff/:id", staffController.updateStaff);
router.delete("/staff/:id", staffController.deleteStaff);


//Quan ly phong ban
router.get("/departments", departmentController.getAllDepartments);
router.get("/departments/:id", departmentController.getDepartmentById);
router.post("/departments", departmentController.createDepartment);
router.put("/departments/:id", departmentController.updateDepartment);
router.delete("/departments/:id", departmentController.deleteDepartment);


//Quan ly nguoi dung
router.get("/users", controller.getAllUsers);
router.get("/users/:id", controller.getUserById);
router.post("/users", controller.createUser);
router.put("/users/:id", controller.updateUser);
router.patch("/users/:id/status", controller.updateUserStatus);
router.delete("/users/:id", controller.deleteUser);

module.exports = router;
