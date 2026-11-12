const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authModel = require("../models/auth.model");

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

    if (
      !user ||
      !(await bcrypt.compare(password, user.password_hash))
    ) {
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

    const token = jwt.sign(
      {},
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        subject: String(user.user_id),
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      }
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

module.exports = { login };