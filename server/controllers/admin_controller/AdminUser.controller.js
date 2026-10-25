
const bcrypt = require("bcryptjs");
const userModel = require("../../models/admin_model/AdminUser.model");

const ALLOWED_ROLES = [
  "PATIENT",
  "DOCTOR",
  "RECEPTIONIST",
  "LAB_TECH",
  "ADMIN"
];

const isValidId = (id) =>
  /^\d+$/.test(String(id)) && Number(id) > 0;

// GET: Lấy danh sách tài khoản
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();

    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error("getAllUsers:", error.message);

    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách tài khoản"
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
        message: "ID tài khoản không hợp lệ"
      });
    }

    const user = await userModel.getUserById(Number(id));

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản"
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("getUserById:", error.message);

    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy chi tiết tài khoản"
    });
  }
};

// POST: Tạo tài khoản
const createUser = async (req, res) => {
  try {
    const { username, password, email, phone, role } = req.body;

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      typeof email !== "string" ||
      typeof phone !== "string" ||
      typeof role !== "string" ||
      !username.trim() ||
      !password ||
      !email.trim() ||
      !phone.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ username, password, email, phone và role"
      });
    }

    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu phải có từ 8 đến 72 ký tự"
      });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role không hợp lệ"
      });
    }

    const cleanData = {
      username: username.trim(),
      email: email.trim(),
      phone: phone.trim()
    };

    const existing = await userModel.findExistingUser(cleanData);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Username, email hoặc phone đã tồn tại"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userModel.createUser({
      ...cleanData,
      passwordHash,
      role
    });

    return res.status(201).json({
      success: true,
      message: "Tạo tài khoản thành công",
      data: user
    });
  } catch (error) {
    console.error("createUser:", error.message);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Username, email hoặc phone đã tồn tại"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo tài khoản"
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
        message: "ID tài khoản không hợp lệ"
      });
    }

    const currentUser = await userModel.getUserById(Number(id));

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản"
      });
    }

    const data = {};

    for (const field of ["username", "email", "phone", "role"]) {
      if (req.body[field] !== undefined) {
        if (
          typeof req.body[field] !== "string" ||
          !req.body[field].trim()
        ) {
          return res.status(400).json({
            success: false,
            message: `${field} không được để trống`
          });
        }

        data[field] = req.body[field].trim();
      }
    }

    if (data.role && !ALLOWED_ROLES.includes(data.role)) {
      return res.status(400).json({
        success: false,
        message: "Role không hợp lệ"
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
          message: "Mật khẩu phải có từ 8 đến 72 ký tự"
        });
      }

      data.passwordHash = await bcrypt.hash(password, 10);
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không có thông tin để cập nhật"
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
        phone: data.phone ?? currentUser.phone
      });

      if (existing && existing.user_id !== Number(id)) {
        return res.status(409).json({
          success: false,
          message: "Username, email hoặc phone đã tồn tại"
        });
      }
    }

    const user = await userModel.updateUser(Number(id), data);

    return res.status(200).json({
      success: true,
      message: "Cập nhật tài khoản thành công",
      data: user
    });
  } catch (error) {
    console.error("updateUser:", error.message);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Username, email hoặc phone đã tồn tại"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật tài khoản"
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
        message: "ID tài khoản không hợp lệ"
      });
    }

    if (typeof is_active !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "is_active phải là true hoặc false"
      });
    }

    const currentUser = await userModel.getUserById(Number(id));

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản"
      });
    }

    const user = await userModel.updateUserStatus(
      Number(id),
      is_active
    );

    return res.status(200).json({
      success: true,
      message: is_active
        ? "Đã mở khóa tài khoản"
        : "Đã khóa tài khoản",
      data: user
    });
  } catch (error) {
    console.error("updateUserStatus:", error.message);

    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật trạng thái"
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserStatus
};
