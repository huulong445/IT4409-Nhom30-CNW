const jwt = require("jsonwebtoken");
const userModel = require("../models/admin_model/AdminUser.model");

const authenticate = async (req, res, next) => {
  const authorization = req.get("authorization") || "";
  const match = /^Bearer\s+(\S+)$/i.exec(authorization);

  if (!match) {
    return res.status(401).json({
      success: false,
      message: "Vui lòng đăng nhập",
    });
  }

  let payload;

  try {
    payload = jwt.verify(match[1], process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (
      typeof payload !== "object" ||
      !/^[1-9]\d*$/.test(payload.sub || "") ||
      !Number.isSafeInteger(Number(payload.sub))
    ) {
      throw new Error("Invalid subject");
    }
  } catch {
    return res.status(401).json({
      success: false,
      message: "Token không hợp lệ hoặc đã hết hạn",
    });
  }

  try {
    const user = await userModel.getUserById(Number(payload.sub));

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Tài khoản không tồn tại",
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản đã bị khóa",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error("authenticate:", error.message);

    return res.status(500).json({
      success: false,
      message: "Lỗi server khi xác thực",
    });
  }
};

module.exports = { authenticate };