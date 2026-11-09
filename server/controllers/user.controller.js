const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách người dùng thành công!",
      data: users,
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách người dùng: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await userModel.getUserById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy user",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Truy vấn người dùng theo ID OK",
      data: user,
    });
  } catch (error) {
    console.error("Không lấy được thông tin user: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// const getPasswordByUser = async (req, res) => {
//   try {
//     const { username } = req.body;
//     const pass = await userModel.getPasswordByUser(username);
//     return res.status(200).json({
//       success: true,
//       message: "Truy vấn password OK",
//       data: pass,
//     });
//   } catch (error) {
//     console.error("Không lấy được mật khẩu user: ", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Lỗi server",
//       error: error.message,
//     });
//   }
// };

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đủ thông tin đăng nhập",
      });
    }
    const user = await userModel.getPasswordByUser(username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Tài khoản hoặc mật khẩu không chính xác",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Tài khoản hoặc mật khẩu không chính xác",
      });
    }
    // tạo token
    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "24h" },
    );
    return res.status(200).json({
      success: true,
      // ~ session
      data: {
        token,
        user: {
          id: user.user_id,
          username: user.username,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.log("Lỗi login: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  login,
  getUserById,
};
