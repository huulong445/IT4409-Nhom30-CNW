const db = require("../../config/db.config");

const getById = async (id) => {
  const [rows] = await db.query(
    "SELECT department_id, code, department_name, description, created_at FROM departments WHERE department_id = ?",
    [id]
  );
  return rows[0] || null;
};

const getAll = async ({ search, limit, offset }) => {
  const where = search ? " WHERE code LIKE ? OR department_name LIKE ?" : "";
  const values = search ? [`%${search}%`, `%${search}%`] : [];
  const [[countRows], [rows]] = await Promise.all([
    db.query(`SELECT COUNT(*) AS total FROM departments${where}`, values),
    db.query(
      `SELECT department_id, code, department_name, description, created_at FROM departments${where} ORDER BY department_id DESC LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    ),
  ]);
  return { rows, total: countRows[0].total };
};

const create = async ({ code, department_name, description = null }) => {
  const [result] = await db.query(
    "INSERT INTO departments (code, department_name, description) VALUES (?, ?, ?)",
    [code, department_name, description]
  );
  return getById(result.insertId);
};

const update = async (id, data) => {
  const fields = Object.keys(data);
  await db.query(
    `UPDATE departments SET ${fields.map((field) => `${field} = ?`).join(", ")} WHERE department_id = ?`,
    [...fields.map((field) => data[field]), id]
  );
  return getById(id);
};

const remove = async (id) => {
  // The existing foreign key rejects deletion when staff still references this department.
  const [result] = await db.query("DELETE FROM departments WHERE department_id = ?", [id]);
  return result.affectedRows > 0;
};

module.exports = { getAll, getById, create, update, remove };
