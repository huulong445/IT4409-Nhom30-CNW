const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  port: process.env.DB_PORT || 3306,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "hospital_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
});

const testDBCon = async () => {
  try {
    const conn = pool.getConnection();
    console.log("Kết nối DB thành công");
    (await conn).release();
  } catch (error) {
    console.error("Kết nối DB thất bại: ", error.message);
  }
};

testDBCon();

module.exports = pool;
