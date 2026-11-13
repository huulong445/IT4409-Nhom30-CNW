const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authModel = require("../models/auth.model");
const AdminUserModel = require("../models/admin_model/AdminUser.model");
const login = async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (
      typeof username !== "string" ||
      !username.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập username và password",
      });
    }

    const user = await authModel.findByUsername(username.trim());

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({
        success: false,
        message: "Tên đăng nhập hoặc mật khẩu không đúng",
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản đã bị khóa",
      });
    }

    const payload = {
      userId: user.user_id,
      role: user.role,
      username: user.username,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "hospital_secret_key",
      {
        algorithm: "HS256",
        subject: String(user.user_id),
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      },
    );

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          user_id: user.user_id,
          username: user.username,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("login:", error.message);

    return res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng nhập",
    });
  }
};

const register = async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      typeof email !== "string" ||
      typeof phone !== "string" ||
      !username.trim() ||
      !password ||
      !email.trim() ||
      !phone.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ username, password và email!",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Địa chỉ Email không đúng định dạng!",
      });
    }
    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu phải có độ dài từ 8 đến 72 ký tự!",
      });
    }

    const cleanData = {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
    };

    const existing = await AdminUserModel.findExistingUser(cleanData);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Username, Email hoặc Số điện thoại đã được sử dụng!",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await AdminUserModel.createUser({
      ...cleanData,
      password_hash,
      role: "PATIENT",
    });

    return res.status(201).json({
      success: true,
      message: "Đăng ký tài khoản thành công!",
      data: {
        user_id: newUser.insertId || newUser.user_id,
        username: cleanData.username,
        email: cleanData.email,
        role: "PATIENT",
      },
    });
  } catch (error) {
    console.error("Lỗi register:", error.message);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Username, Email hoặc Số điện thoại đã tồn tại!",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Lỗi server nội bộ khi đăng ký tài khoản!",
    });
  }
};

const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    console.error("Lỗi đăng xuất", error.message);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng xuất",
    });
  }
};
module.exports = { login, register, logout };
