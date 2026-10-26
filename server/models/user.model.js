const db = require("../config/db.config");

const getAllUsers = async () => {
  const [rows] = await db.query(
    "SELECT user_id, username, email, role FROM users",
  );
  return rows;
};
const getUserById = async (userId) => {
  const [rows] = await db.query(
    "SELECT username, email, role FROM users WHERE user_id = ?",
    [userId],
  );
  return rows[0] || null;
};
const getPasswordByUser = async (username) => {
  const [rows] = await db.query(
    "SELECT user_id, role, is_active, password_hash FROM users WHERE username = ?",
    [username],
  );
  return rows[0] || null;
};
module.exports = { getAllUsers, getUserById, getPasswordByUser };
