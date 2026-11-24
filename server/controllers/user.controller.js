const userModel = require("../models/user.model");

const getOwnProfile = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.user.user_id);

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
    console.error("getOwnProfile:", error.message);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy hồ sơ",
    });
  }
};

const updateOwnProfile = async (req, res) => {
  const allowedFields = ["username", "email", "phone"];
  const body = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu hồ sơ không hợp lệ",
    });
  }

  const unknownFields = Object.keys(body).filter(
    (field) => !allowedFields.includes(field),
  );
  if (unknownFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Không hỗ trợ cập nhật các trường: ${unknownFields.join(", ")}`,
    });
  }

  const data = {};
  for (const field of allowedFields) {
    if (body[field] === undefined) {
      continue;
    }

    if (typeof body[field] !== "string" || !body[field].trim()) {
      return res.status(400).json({
        success: false,
        message: `${field} phải là chuỗi và không được để trống`,
      });
    }

    data[field] = body[field].trim();
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng cung cấp ít nhất một thông tin cần cập nhật",
    });
  }

  if (
    data.username !== undefined &&
    !/^[a-zA-Z0-9_]{3,30}$/.test(data.username)
  ) {
    return res.status(400).json({
      success: false,
      message: "Tên đăng nhập phải từ 3-30 ký tự, chỉ gồm chữ, số và dấu gạch dưới",
    });
  }

  if (data.email !== undefined) {
    data.email = data.email.toLowerCase();
    if (
      data.email.length > 100 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    ) {
      return res.status(400).json({
        success: false,
        message: "Địa chỉ email không hợp lệ",
      });
    }
  }

  if (data.phone !== undefined && data.phone.length > 20) {
    return res.status(400).json({
      success: false,
      message: "Số điện thoại không được vượt quá 20 ký tự",
    });
  }

  try {
    const user = await userModel.updateProfile(req.user.user_id, data);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật hồ sơ thành công",
      data: user,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Tên đăng nhập, email hoặc số điện thoại đã được sử dụng",
      });
    }

    console.error("updateOwnProfile:", error.message);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật hồ sơ",
    });
  }
};

const deactivateOwnAccount = async (req, res) => {
  try {
    const deactivated = await userModel.deactivateAccount(req.user.user_id);

    if (!deactivated) {
      return res.status(404).json({
        success: false,
        message: "Tài khoản không tồn tại hoặc đã bị vô hiệu hóa",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tài khoản đã được vô hiệu hóa",
    });
  } catch (error) {
    console.error("deactivateOwnAccount:", error.message);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi vô hiệu hóa tài khoản",
    });
  }
};

module.exports = { getOwnProfile, updateOwnProfile, deactivateOwnAccount };
