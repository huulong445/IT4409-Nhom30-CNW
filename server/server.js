const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares cơ bản
app.use(cors());
app.use(express.json()); // Đọc dữ liệu JSON từ request body

// API Test đơn giản
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Hospital API Server is running properly!",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});
