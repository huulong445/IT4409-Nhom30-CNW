const db = require("../config/db.config");

const getAllUsers = async () => {
  const [rows] = await db.query(
    "SELECT user_id, username, email, role FROM users",
  );
  return rows;
};
const getUserById = async (userId) => {
  const [rows] = await db.query(
    `SELECT user_id, username, email, phone, role, updated_at
     FROM users
     WHERE user_id = ?`,
    [userId],
  );
  return rows[0] || null;
};

const updateProfile = async (userId, data) => {
  const allowedFields = ["username", "email", "phone"];
  const fields = [];
  const values = [];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(data[field]);
    }
  }

  if (fields.length === 0) {
    return getUserById(userId);
  }

  values.push(userId);
  await db.query(
    `UPDATE users SET ${fields.join(", ")} WHERE user_id = ?`,
    values,
  );

  return getUserById(userId);
};

const deactivateAccount = async (userId) => {
  const [result] = await db.query(
    "UPDATE users SET is_active = FALSE WHERE user_id = ? AND is_active = TRUE",
    [userId],
  );

  return result.affectedRows > 0;
};

const getPasswordByUser = async (username) => {
  const [rows] = await db.query(
    "SELECT user_id, role, is_active, password_hash FROM users WHERE username = ?",
    [username],
  );
  return rows[0] || null;
};
module.exports = {
  getAllUsers,
  getUserById,
  updateProfile,
  deactivateAccount,
  getPasswordByUser,
};
