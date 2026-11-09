const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "'Truy cập bị từ chối! Vui lòng cung cấp token đăng nhập'",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Token không hợp lệ hoặc đã hết hạn!",
    });
  }
};
// 403: server understood the req but refuses to authorize it
// 401: lacks authen credentials for the requested resources
module.exports = {
  verifyToken,
};
