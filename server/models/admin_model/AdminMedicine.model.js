const db = require("../../config/db.config");

const getById = async (id) => {
  const [rows] = await db.query(
    `SELECT med_id, name, unit_price, quantity,
            is_insurance_covered, unit
     FROM medicine
     WHERE med_id = ?`,
    [id]
  );

  return rows[0] || null;
};

const getAll = async ({ search, limit, offset }) => {
  const where = search ? "WHERE name LIKE ? OR unit LIKE ?" : "";
  const values = search ? [`%${search}%`, `%${search}%`] : [];

  const [[countRows], [rows]] = await Promise.all([
    db.query(`SELECT COUNT(*) AS total FROM medicine ${where}`, values),
    db.query(
      `SELECT med_id, name, unit_price, quantity,
              is_insurance_covered, unit
       FROM medicine
       ${where}
       ORDER BY med_id DESC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    ),
  ]);

  return { rows, total: countRows[0].total };
};

const create = async ({ name, unit_price, quantity, is_insurance_covered, unit }) => {
  const [result] = await db.query(
    `INSERT INTO medicine
      (name, unit_price, quantity, is_insurance_covered, unit)
     VALUES (?, ?, ?, ?, ?)`,
    [name, unit_price, quantity, is_insurance_covered, unit]
  );

  return getById(result.insertId);
};

const update = async (id, data) => {
  const fields = Object.keys(data);

  await db.query(
    `UPDATE medicine
     SET ${fields.map((field) => `${field} = ?`).join(", ")}
     WHERE med_id = ?`,
    [...fields.map((field) => data[field]), id]
  );

  return getById(id);
};

const remove = async (id) => {
  const [result] = await db.query(
    "DELETE FROM medicine WHERE med_id = ?",
    [id]
  );

  return result.affectedRows > 0;
};

module.exports = { getById, getAll, create, update, remove };
