
const db = require("../../config/db.config");

// 1. Lấy danh sách tài khoản
const getAllUsers = async () => {
  const [rows] = await db.query(`
    SELECT user_id, username, email, phone, role,
           is_active, created_at, updated_at
    FROM users
    ORDER BY user_id DESC
  `);

  return rows;
};

// 2. Lấy tài khoản theo ID
const getUserById = async (id) => {
  const [rows] = await db.query(
    `SELECT user_id, username, email, phone, role,
            is_active, created_at, updated_at
     FROM users
     WHERE user_id = ?`,
    [id]
  );

  return rows[0] || null;
};

// 3. Kiểm tra username, email hoặc phone đã tồn tại
const findExistingUser = async ({
  username,
  email,
  phone,
  excludeUserId = null,
}) => {
  const [rows] = await db.query(
    `SELECT user_id, username, email, phone
     FROM users
     WHERE (username = ? OR email = ? OR phone = ?)
       AND (? IS NULL OR user_id <> ?)
     LIMIT 1`,
    [username, email, phone, excludeUserId, excludeUserId]
  );

  return rows[0] || null;
};

// 4. Tạo tài khoản
const createUser = async ({
  username,
  passwordHash,
  email,
  phone,
  role
}) => {
  const [result] = await db.query(
    `INSERT INTO users
      (username, password_hash, email, phone, role)
     VALUES (?, ?, ?, ?, ?)`,
    [username, passwordHash, email, phone, role]
  );

  return getUserById(result.insertId);
};

// 5. Cập nhật thông tin tài khoản
const updateUser = async (id, data) => {
  const fields = [];
  const values = [];

  const allowedFields = ["username", "email", "phone", "role"];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(data[field]);
    }
  }

  if (data.passwordHash !== undefined) {
    fields.push("password_hash = ?");
    values.push(data.passwordHash);
  }

  if (fields.length === 0) {
    return getUserById(id);
  }

  values.push(id);

  await db.query(
    `UPDATE users SET ${fields.join(", ")}
     WHERE user_id = ?`,
    values
  );

  return getUserById(id);
};

// 6. Khóa hoặc mở khóa tài khoản
const updateUserStatus = async (id, isActive) => {
  await db.query(
    "UPDATE users SET is_active = ? WHERE user_id = ?",
    [isActive, id]
  );

  return getUserById(id);
};

module.exports = {
  getAllUsers,
  getUserById,
  findExistingUser,
  createUser,
  updateUser,
  updateUserStatus
};
