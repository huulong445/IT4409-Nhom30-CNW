const bcrypt = require("bcryptjs");
const userModel = require("../../models/admin_model/AdminUser.model");
const { ALLOWED_ROLES } = require("../../config/roles");
//const ALLOWED_ROLES = [
//"PATIENT",
//"DOCTOR",
// "RECEPTIONIST",
//"LAB_TECH",
//"ADMIN"
//];

const isValidId = (id) => /^\d+$/.test(String(id)) && Number(id) > 0;

// GET: Lấy danh sách tài khoản
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("getAllUsers:", error.message);

    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách tài khoản",
    });
  }
};
const createUserByAdmin = async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      full_name,
      phone_number,
      role,
      department_id,
    } = req.body;

    if (!username || !password || !email || !full_name || !role) {
      return res.status(400).json({
        success: false,
        message:
          "Vui lòng cung cấp đầy đủ thông tin: username, password, email, full_name, và role!",
      });
    }

    // b. Validate định dạng Username (Tối thiểu 3 ký tự, chỉ chứa chữ cái, số, dấu gạch dưới)
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!usernameRegex.test(username.trim())) {
      return res.status(400).json({
        success: false,
        message:
          "Tên đăng nhập phải từ 3-30 ký tự và không chứa ký tự đặc biệt!",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu phải có ít nhất 8 ký tự!",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Địa chỉ Email không đúng định dạng!",
      });
    }

    const normalizedRole = role.toUpperCase();
    if (!ALLOWED_ROLES.includes(normalizedRole)) {
      return res.status(400).json({
        success: false,
        message: `Vai trò không hợp lệ! Vai trò phải là một trong các giá trị: ${validRoles.join(", ")}`,
      });
    }

    if (
      ["DOCTOR", "LAB_TECH", "RECEPTIONIST"].includes(normalizedRole) &&
      !department_id
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn Khoa/Phòng (department_id) cho nhân viên!",
      });
    }

    // -------------------------------------------------------------------------
    // 2. KIỂM TRA TRÙNG LẶP DỮ LIỆU (DUPLICATE CHECK)
    // -------------------------------------------------------------------------
    const existingUser = await userModel.findExistingUser(
      username.trim(),
      email.trim(),
    );
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "Tên đăng nhập (username) hoặc Email đã tồn tại trong hệ thống!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUserId = await userModel.createUser({
      username: username.trim(),
      password_hash,
      email: email.trim().toLowerCase(),
      full_name: full_name.trim(),
      phone_number: phone_number ? phone_number.trim() : null,
      role: normalizedRole,
    });

    if (
      ["DOCTOR", "RECEPTIONIST", "LAB_TECH"].includes(normalizedRole) &&
      department_id
    ) {
      await userModel.createStaffProfile({
        user_id: newUserId,
        department_id,
        full_name: full_name.trim(),
      });
    }

    return res.status(201).json({
      success: true,
      message: `Đã tạo thành công tài khoản cho nhân viên với vai trò ${normalizedRole}!`,
      data: {
        user_id: newUserId,
        username: username.trim(),
        email: email.trim().toLowerCase(),
        full_name: full_name.trim(),
        role: normalizedRole,
        department_id: department_id || null,
      },
    });
  } catch (error) {
    console.error("Lỗi createUserByAdmin:", error.message);
    return res.status(500).json({
      success: false,
      message: "Lỗi server nội bộ khi tạo tài khoản!",
      error: error.message,
    });
  }
};
// GET: Lấy chi tiết tài khoản
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID tài khoản không hợp lệ",
      });
    }

    const user = await userModel.getUserById(Number(id));

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("getUserById:", error.message);

    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy chi tiết tài khoản",
    });
  }
};

// PUT: Cập nhật thông tin tài khoản
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID tài khoản không hợp lệ",
      });
    }

    const currentUser = await userModel.getUserById(Number(id));

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản",
      });
    }

    const data = {};

    for (const field of ["username", "email", "phone", "role"]) {
      if (req.body[field] !== undefined) {
        if (typeof req.body[field] !== "string" || !req.body[field].trim()) {
          return res.status(400).json({
            success: false,
            message: `${field} không được để trống`,
          });
        }

        data[field] = req.body[field].trim();
      }
    }

    if (data.role && !ALLOWED_ROLES.includes(data.role)) {
      return res.status(400).json({
        success: false,
        message: "Role không hợp lệ",
      });
    }
    if (
      Number(id) === req.user.user_id &&
      data.role !== undefined &&
      data.role !== req.user.role
    ) {
      return res.status(400).json({
        success: false,
        message: "Bạn không được tự thay đổi vai trò của mình",
      });
    }

    if (req.body.password !== undefined) {
      const { password } = req.body;

      if (
        typeof password !== "string" ||
        password.length < 8 ||
        password.length > 72
      ) {
        return res.status(400).json({
          success: false,
          message: "Mật khẩu phải có từ 8 đến 72 ký tự",
        });
      }

      data.passwordHash = await bcrypt.hash(password, 10);
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không có thông tin để cập nhật",
      });
    }

    if (
      data.username !== undefined ||
      data.email !== undefined ||
      data.phone !== undefined
    ) {
      const existing = await userModel.findExistingUser({
        username: data.username ?? currentUser.username,
        email: data.email ?? currentUser.email,
        phone: data.phone ?? currentUser.phone,
        excludeUserId: Number(id),
      });

      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Username, email hoặc phone đã tồn tại",
        });
      }
    }

    const user = await userModel.updateUser(Number(id), data);

    return res.status(200).json({
      success: true,
      message: "Cập nhật tài khoản thành công",
      data: user,
    });
  } catch (error) {
    console.error("updateUser:", error.message);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Username, email hoặc phone đã tồn tại",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật tài khoản",
    });
  }
};

// PATCH: Khóa hoặc mở khóa tài khoản
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID tài khoản không hợp lệ",
      });
    }

    if (typeof is_active !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "is_active phải là true hoặc false",
      });
    }
    if (Number(id) === req.user.user_id && is_active === false) {
      return res.status(400).json({
        success: false,
        message: "Bạn không được tự khóa tài khoản của mình",
      });
    }

    const currentUser = await userModel.getUserById(Number(id));

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản",
      });
    }

    const user = await userModel.updateUserStatus(Number(id), is_active);

    return res.status(200).json({
      success: true,
      message: is_active ? "Đã mở khóa tài khoản" : "Đã khóa tài khoản",
      data: user,
    });
  } catch (error) {
    console.error("updateUserStatus:", error.message);

    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật trạng thái",
    });
  }
};

// DELETE: Xóa tài khoản
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id) || !Number.isSafeInteger(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "ID tài khoản không hợp lệ",
      });
    }

    const userId = Number(id);

    // Ngăn admin tự xóa tài khoản đang đăng nhập
    if (userId === Number(req.user.user_id)) {
      return res.status(400).json({
        success: false,
        message: "Bạn không được tự xóa tài khoản của mình",
      });
    }

    const deleted = await userModel.deleteUser(userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Xóa tài khoản thành công",
    });
  } catch (error) {
    console.error("deleteUser:", error.message);

    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        success: false,
        message:
          "Tài khoản có dữ liệu liên quan nên không thể xóa. Bạn có thể khóa tài khoản.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa tài khoản",
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  createUserByAdmin,
  updateUserStatus,
  deleteUser,
};
