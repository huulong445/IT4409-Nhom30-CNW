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

// Import Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const patientRoutes = require("./routes/patient.routes");
const doctorRoutes = require("./routes/doctor.routes");
const adminRoutes = require("./routes/admin_routes/admin.routes");
// Mount Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/patients", patientRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/doctor", doctorRoutes);

// test
app.get("/api/v1/test", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server đang chạy tốt!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
