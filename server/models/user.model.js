const db = require("../config/db.config");

const getAllUsers = async () => {
  const [rows] = await db.query(
    "SELECT user_id, username, email, role FROM users",
  );
  return rows;
};

module.exports = { getAllUsers };
