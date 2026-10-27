const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Import Routes
const userRoutes = require("./routes/user.routes");
const doctorRoutes = require("./routes/doctor.routes");

// Mount Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/doctor", doctorRoutes);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server đang chạy tốt!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

//admin Route
const adminRoutes = require("./routes/admin_routes/admin.routes");
app.use("/api/v1/admin", adminRoutes);
