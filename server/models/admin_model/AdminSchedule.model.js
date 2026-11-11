const db = require("../../config/db.config");

const SELECT_ASSIGNMENT = `
  SELECT ss.staff_shift_id, ss.staff_id, s.full_name, s.department_id,
         d.department_name, ss.shift_id, sh.shift_name, sh.start_time,
         sh.end_time, ss.room_id, r.room_number, r.room_name, ss.work_date
  FROM staff_shifts ss
  JOIN staff s ON s.staff_id = ss.staff_id
  JOIN departments d ON d.department_id = s.department_id
  JOIN shifts sh ON sh.shift_id = ss.shift_id
  JOIN rooms r ON r.room_id = ss.room_id
`;

const getAll = async ({ staffId, departmentId, roomId, from, to, limit, offset }) => {
  const conditions = [];
  const values = [];
  for (const [column, value] of [["ss.staff_id", staffId], ["s.department_id", departmentId], ["ss.room_id", roomId]]) {
    if (value !== undefined) { conditions.push(`${column} = ?`); values.push(value); }
  }
  if (from) { conditions.push("ss.work_date >= ?"); values.push(from); }
  if (to) { conditions.push("ss.work_date <= ?"); values.push(to); }
  const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : "";
  const [[countRows], [rows]] = await Promise.all([
    db.query(`SELECT COUNT(*) AS total FROM staff_shifts ss JOIN staff s ON s.staff_id = ss.staff_id${where}`, values),
    db.query(`${SELECT_ASSIGNMENT}${where} ORDER BY ss.work_date, sh.start_time, s.full_name LIMIT ? OFFSET ?`, [...values, limit, offset]),
  ]);
  return { rows, total: countRows[0].total };
};

const getById = async (id) => {
  const [rows] = await db.query(`${SELECT_ASSIGNMENT} WHERE ss.staff_shift_id = ?`, [id]);
  return rows[0] || null;
};

const getShifts = async () => {
  const [rows] = await db.query("SELECT shift_id, shift_name, start_time, end_time FROM shifts ORDER BY start_time");
  return rows;
};

const getRooms = async () => {
  const [rows] = await db.query("SELECT room_id, room_number, room_name, room_type, department_id FROM rooms ORDER BY room_number");
  return rows;
};

const exists = async (table, id) => {
  const [rows] = await db.query(`SELECT 1 FROM ${table} WHERE ${table === "staff" ? "staff_id" : table === "shifts" ? "shift_id" : "room_id"} = ?`, [id]);
  return rows.length > 0;
};

const hasConflict = async ({ staff_id, shift_id, work_date, excludeId }) => {
  const [rows] = await db.query(
    `SELECT ss.staff_shift_id FROM staff_shifts ss
     JOIN shifts existing ON existing.shift_id = ss.shift_id
     JOIN shifts requested ON requested.shift_id = ?
     WHERE ss.staff_id = ? AND ss.work_date = ?
       AND existing.start_time < requested.end_time
       AND requested.start_time < existing.end_time
       AND (? IS NULL OR ss.staff_shift_id <> ?)`,
    [shift_id, staff_id, work_date, excludeId ?? null, excludeId ?? null]
  );
  return rows.length > 0;
};

const create = async ({ staff_id, shift_id, room_id, work_date }) => {
  const [result] = await db.query("INSERT INTO staff_shifts (staff_id, shift_id, room_id, work_date) VALUES (?, ?, ?, ?)", [staff_id, shift_id, room_id, work_date]);
  return getById(result.insertId);
};

const update = async (id, data) => {
  const fields = Object.keys(data);
  await db.query(`UPDATE staff_shifts SET ${fields.map((field) => `${field} = ?`).join(", ")} WHERE staff_shift_id = ?`, [...fields.map((field) => data[field]), id]);
  return getById(id);
};

const remove = async (id) => {
  const [result] = await db.query("DELETE FROM staff_shifts WHERE staff_shift_id = ?", [id]);
  return result.affectedRows > 0;
};

module.exports = { getAll, getById, getShifts, getRooms, exists, hasConflict, create, update, remove };
