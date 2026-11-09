# IT4409-Hospital-Web-Application

## Cấu trúc dự án

```
hospital-app/
├── server/                     # Backend (Node.js + Express)
├── client/                     # Frontend (React + Tailwind/Bootstrap)
├── database/                   # Quản lý SQL & Migration
│   ├── schema.sql
│   └── seed.sql
├── .gitignore
├── README.md
└── package.json
```

### Cấu trúc backend (server)

```
server/
├── src/
│   ├── config/                 # Cấu hình môi trường, DB connection
│   │   ├── db.config.js        # Kết nối MySQL (mysql2 / Sequelize / Prisma)
│   │   ├── jwt.config.js       # Cấu hình JWT Secret & Expiry
│   │   └── env.js              # Biến môi trường process.env
│   │
│   ├── controllers/            # Nhận request, validate dữ liệu, trả response
│   │   ├── auth.controller.js  # Đăng nhập, đăng ký
│   │   ├── user.controller.js  # Quản lý hồ sơ
│   │   ├── appointment.controller.js
│   │   ├── medicalRecord.controller.js
│   │   └── lab.controller.js
│   │
│   ├── middlewares/            # Các Middleware xử lý trung gian
│   │   ├── auth.middleware.js  # Verify JWT Token
│   │   ├── rbac.middleware.js  # Phân quyền 5 Roles (ADMIN, DOCTOR, PATIENT,...)
│   │   └── error.middleware.js # Xử lý lỗi tập trung (Global Error Handler)
│   │
│   ├── models/                 # Chứa các câu query SQL / ORM Schemas
│   │   ├── user.model.js
│   │   ├── patient.model.js
│   │   ├── staff.model.js
│   │   └── appointment.model.js
│   │
│   ├── services/               # Xử lý Business Logic chính
│   │   ├── auth.service.js
│   │   ├── appointment.service.js
│   │   └── lab.service.js
│   │
│   ├── routes/                 # Định nghĩa các Endpoints API
│   │   ├── index.js            # Gom tất cả routes
│   │   ├── auth.routes.js
│   │   ├── doctor.routes.js
│   │   ├── patient.routes.js
│   │   └── lab.routes.js
│   │
│   ├── utils/                  # Thư viện dùng chung
│   │   ├── hashPassword.js     # Hash mật khẩu (bcrypt)
│   │   └── responseHandler.js  # Standard Format trả về (success, error, data)
│   │
│   └── app.js                  # Khởi tạo Express app & middlewares
│
├── .env.example                # File mẫu biến môi trường
├── package.json
└── server.js                   # Entry point chạy server (app.listen)
```

### Cấu trúc frontend (client)

```
client/
├── src/
│   ├── assets/                 # Hình ảnh, logo, icons
│   ├── components/             # Reusable UI Kit dùng chung toàn app
│   │   ├── common/             # Button, Input, Modal, Table, Badge
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   │
│   ├── contexts/               # React Context (AuthContext, ThemeContext)
│   │   └── AuthContext.jsx     # Lưu trạng thái đăng nhập, user profile, token
│   │
│   ├── layouts/                # Khung Giao diện riêng cho từng Tác nhân
│   │   ├── PatientLayout.jsx   # Layout cho Bệnh nhân (Header + Navbar mobile/web)
│   │   ├── DashboardLayout.jsx # Layout cho Bác sĩ, Tiếp tân, Lab, Admin (Sidebar)
│   │   └── AuthLayout.jsx      # Layout cho màn Login / Register
│   │
│   ├── pages/                  # Các Màn hình hiển thị theo Tác nhân
│   │   ├── auth/               # Login, Register
│   │   ├── patient/            # Đặt lịch, Xem hồ sơ bệnh án cá nhân
│   │   ├── doctor/             # Danh sách hàng đợi khám, Lập bệnh án & Đơn thuốc
│   │   ├── receptionist/       # Sảnh tiếp đón, Check-in QR, Cấp số
│   │   ├── lab/                # Nhập & Trả kết quả xét nghiệm
│   │   ├── admin/              # Bảng quản lý User, Khoa phòng, Thống kê
│   │   └── NotFound.jsx        # Trang lỗi 404
│   │
│   ├── routes/                 # Điều hướng & Chặn truy cập (Protected Routes)
│   │   ├── AppRoutes.jsx       # Khai báo React Router
│   │   └── ProtectedRoute.jsx  # Chặn người dùng truy cập sai Role
│   │
│   ├── services/               # Quản lý các lệnh gọi API (Axios Instance)
│   │   ├── api.js              # Cấu hình Axios BaseURL & Interceptors (Gắn JWT)
│   │   ├── authService.js
│   │   ├── appointmentService.js
│   │   └── userService.js
│   │
│   ├── styles/                 # Config Tailwind / Custom CSS / Bootstrap
│   │   └── index.css
│   │
│   ├── App.jsx
│   └── main.jsx                # Entry point của React (Vite / CRA)
│
├── tailwind.config.js          # File cấu hình Tailwind CSS (nếu dùng Tailwind)
├── package.json
└── vite.config.js
```

## BE

```
cd root/server
npm install

# Chạy SV
npm run dev

```

Server check

```
http://localhost:5000/api/v1/health
```

## Khởi tạo DB

1. Đăng nhập MySQL local

```
mysql -u root -p
```

2. Tạo bảng + insert data

```
USE hospital_db;
SOURCE schema.sql;
SOURCE data.sql;
```

2.5 Tạo JWT Secret Key

```
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

3. Tạo file `.env` tại root

```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=ur_mysql_pass_here
DB_NAME=hospital_db
JWT_SECRET=jwt_secret_key_here
```

## FE

```
cd root/client
npm install
npm run dev
```
