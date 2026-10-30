const db = require("../../config/db.config");

const SELECT_STAFF = `
  SELECT s.staff_id, s.user_id, s.department_id,
         s.full_name, s.title, s.license_number, s.created_at,
         u.username, u.email, u.phone, u.role, u.is_active,
         d.code AS department_code, d.department_name
  FROM staff s
  JOIN users u ON u.user_id = s.user_id
  JOIN departments d ON d.department_id = s.department_id
`;

const getById = async (id) => {
  const [rows] = await db.query(
    `${SELECT_STAFF} WHERE s.staff_id = ?`,
    [id]
  );

  return rows[0] || null;
};

const getAll = async ({
  search,
  departmentId,
  role,
  limit,
  offset,
}) => {
  const conditions = [];
  const values = [];

  if (search) {
    conditions.push("s.full_name LIKE ?");
    values.push(`%${search}%`);
  }

  if (departmentId !== undefined) {
    conditions.push("s.department_id = ?");
    values.push(departmentId);
  }

  if (role !== undefined) {
    conditions.push("u.role = ?");
    values.push(role);
  }

  const where = conditions.length
    ? ` WHERE ${conditions.join(" AND ")}`
    : "";

  const [[countRows], [rows]] = await Promise.all([
    db.query(
      `SELECT COUNT(*) AS total
       FROM staff s
       JOIN users u ON u.user_id = s.user_id
       ${where}`,
      values
    ),
    db.query(
      `${SELECT_STAFF}
       ${where}
       ORDER BY s.staff_id DESC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    ),
  ]);

  return {
    rows,
    total: countRows[0].total,
  };
};

const getUserById = async (id) => {
  const [rows] = await db.query(
    "SELECT user_id, role FROM users WHERE user_id = ?",
    [id]
  );

  return rows[0] || null;
};

const departmentExists = async (id) => {
  const [rows] = await db.query(
    "SELECT department_id FROM departments WHERE department_id = ?",
    [id]
  );

  return rows.length > 0;
};

const create = async ({
  user_id,
  department_id,
  full_name,
  title = null,
  license_number = null,
}) => {
  const [result] = await db.query(
    `INSERT INTO staff
       (user_id, department_id, full_name, title, license_number)
     VALUES (?, ?, ?, ?, ?)`,
    [user_id, department_id, full_name, title, license_number]
  );

  return getById(result.insertId);
};

const update = async (id, data) => {
  const allowedFields = [
    "department_id",
    "full_name",
    "title",
    "license_number",
  ];

  const fields = allowedFields.filter(
    (field) => data[field] !== undefined
  );

  if (fields.length === 0) {
    return getById(id);
  }

  await db.query(
    `UPDATE staff
     SET ${fields.map((field) => `${field} = ?`).join(", ")}
     WHERE staff_id = ?`,
    [...fields.map((field) => data[field]), id]
  );

  return getById(id);
};

const remove = async (id) => {
  const [result] = await db.query(
    "DELETE FROM staff WHERE staff_id = ?",
    [id]
  );

  return result.affectedRows > 0;
};

module.exports = {
  getAll,
  getById,
  getUserById,
  departmentExists,
  create,
  update,
  remove,
};