const userModel = require("../models/user.model");

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách người dùng thành công!",
      data: users,
    });
  } catch (error) {
    console.error("Lỗi getAllUsers:", error.message);
    return res.status(500).json({
      success: false,
      message: "Lỗi server nội bộ!",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
};
