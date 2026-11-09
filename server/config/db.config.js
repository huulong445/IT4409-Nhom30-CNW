const mysql = require("mysql2/promise");
require("dotenv").config();
// dotenv tìm theo vị trí hiện tại của tiến trình node
console.log(process.cwd()); // test
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  port: process.env.DB_PORT || 3306,
  password: process.env.DB_PASSWORD || "Mysql123@...",
  database: process.env.DB_NAME || "hospital",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
});

const testDBCon = async () => {
  try {
    const conn = await pool.getConnection();
    console.log("Kết nối DB thành công!");
    conn.release();
  } catch (error) {
    console.error("Kết nối DB thất bại:");
    console.error("  - Mã lỗi:", error.code);
    console.error("  - Chi tiết:", error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error("  -> Gợi ý: Dịch vụ MySQL chưa được khởi động (bật XAMPP/MySQL service trên máy).");
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error("  -> Gợi ý: Sai tên đăng nhập (DB_USER) hoặc mật khẩu (DB_PASSWORD) trong file .env");
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`  -> Gợi ý: Chưa tồn tại database '${process.env.DB_NAME || "hospital"}'. Hãy tạo database bằng lệnh: CREATE DATABASE hospital;`);
    }
  }
};

testDBCon();

module.exports = pool;
