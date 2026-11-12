const express = require("express");
const cors = require("cors");
require("dotenv").config();
if (!process.env.JWT_SECRET) {
  throw new Error("Thiếu JWT_SECRET trong file .env");
}
const app = express();
// Middlewares
app.use(cors());
app.use(express.json());
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server đang chạy tốt!" });
});

const PORT = process.env.PORT || 5000;
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin_routes/admin.routes");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});


