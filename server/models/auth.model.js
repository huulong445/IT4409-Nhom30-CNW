const db = require("../config/db.config");

const findByUsername = async (username) => {
  const [rows] = await db.query(
    `SELECT u.user_id, u.username, u.password_hash, u.role, u.is_active,
            s.staff_id
     FROM users u
     LEFT JOIN staff s ON s.user_id = u.user_id
     WHERE u.username = ?
     LIMIT 1`,
    [username],
  );

  return rows[0] || null;
};

const register = async () => {
  const res = await db.query("INSERT FROM");
};
module.exports = { findByUsername };
