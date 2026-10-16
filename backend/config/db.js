const mysql = require('mysql2');
require('dotenv').config();

// Tạo một pool kết nối tới MySQL sử dụng biến môi trường từ file .env
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Số lượng kết nối tối đa cùng lúc
  queueLimit: 0
});

// Chuyển đổi sang dạng Promise để dễ dàng dùng async/await khi viết API sau này
const promisePool = pool.promise();

// Kiểm tra kết nối khi khởi động server
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Lỗi kết nối cơ sở dữ liệu MySQL:', err.message);
    if (connection) connection.release();
    return;
  }
  console.log('✅ Đã kết nối thành công tới cơ sở dữ liệu MySQL (Hospital)!');
  connection.release();
});

module.exports = promisePool;