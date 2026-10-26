const db = require("../config/db.config");

const findByUsername = async (username) => {
  const [rows] = await db.query(
    `SELECT user_id, username, password_hash, role, is_active
     FROM users
     WHERE username = ?
     LIMIT 1`,
    [username]
  );

  return rows[0] || null;
};

module.exports = { findByUsername };