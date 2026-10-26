
const express = require("express");
const router = express.Router();

const adminUserController = require("../../controllers/admin_controller/AdminUser.controller");

// Lấy danh sách tài khoản
router.get("/users", adminUserController.getAllUsers);

// Lấy chi tiết tài khoản theo ID
router.get("/users/:id", adminUserController.getUserById);

// Tạo tài khoản mới
router.post("/users", adminUserController.createUser);

// Cập nhật thông tin tài khoản
router.put("/users/:id", adminUserController.updateUser);

// Khóa hoặc mở khóa tài khoản
router.patch("/users/:id/status", adminUserController.updateUserStatus);

module.exports = router;
