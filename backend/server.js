const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import file kết nối database vừa tạo
const db = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// API mẫu kiểm tra kết nối và truy vấn thử database
app.get('/api/test-db', async (req, res) => {
  try {
    // Thử truy vấn đơn giản để kiểm tra
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    res.json({ message: 'Kết nối Database thành công!', result: rows[0].solution });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});