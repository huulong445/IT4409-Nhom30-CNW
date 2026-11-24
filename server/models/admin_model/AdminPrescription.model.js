const db = require("../../config/db.config");

const parseMedicationDetails = (prescription) => {
  if (
    prescription &&
    typeof prescription.medication_details === "string"
  ) {
    prescription.medication_details = JSON.parse(
      prescription.medication_details
    );
  }

  return prescription;
};

const SELECT_PRESCRIPTION = `
  SELECT p.prescription_id, p.record_id, p.doctor_id,
         p.medication_details, p.created_at,
         mr.patient_id,
         pt.full_name AS patient_name,
         s.full_name AS doctor_name,
         s.department_id,
         d.department_name
  FROM prescriptions p
  JOIN medical_records mr ON mr.record_id = p.record_id
  JOIN patients pt ON pt.patient_id = mr.patient_id
  JOIN staff s ON s.staff_id = p.doctor_id
  JOIN departments d ON d.department_id = s.department_id
`;

const getById = async (id) => {
  const [rows] = await db.query(
    `${SELECT_PRESCRIPTION}
     WHERE p.prescription_id = ?`,
    [id]
  );

  return rows[0] ? parseMedicationDetails(rows[0]) : null;
};

const getAll = async ({
  patientId,
  doctorId,
  recordId,
  limit,
  offset,
}) => {
  const conditions = [];
  const values = [];

  if (patientId !== undefined) {
    conditions.push("mr.patient_id = ?");
    values.push(patientId);
  }

  if (doctorId !== undefined) {
    conditions.push("p.doctor_id = ?");
    values.push(doctorId);
  }

  if (recordId !== undefined) {
    conditions.push("p.record_id = ?");
    values.push(recordId);
  }

  const where = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const [[countRows], [rows]] = await Promise.all([
    db.query(
      `SELECT COUNT(*) AS total
       FROM prescriptions p
       JOIN medical_records mr ON mr.record_id = p.record_id
       ${where}`,
      values
    ),
    db.query(
      `${SELECT_PRESCRIPTION}
       ${where}
       ORDER BY p.created_at DESC, p.prescription_id DESC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    ),
  ]);

  return {
    rows: rows.map(parseMedicationDetails),
    total: countRows[0].total,
  };
};

const getMedicalRecordById = async (recordId) => {
  const [rows] = await db.query(
    `SELECT record_id, patient_id, doctor_id
     FROM medical_records
     WHERE record_id = ?`,
    [recordId]
  );

  return rows[0] || null;
};

const create = async ({
  record_id,
  doctor_id,
  medication_details,
}) => {
  const [result] = await db.query(
    `INSERT INTO prescriptions (
      record_id,
      doctor_id,
      medication_details
    ) VALUES (?, ?, ?)`,
    [
      record_id,
      doctor_id,
      JSON.stringify(medication_details),
    ]
  );

  return getById(result.insertId);
};

const update = async (id, medicationDetails) => {
  await db.query(
    `UPDATE prescriptions
     SET medication_details = ?
     WHERE prescription_id = ?`,
    [JSON.stringify(medicationDetails), id]
  );

  return getById(id);
};

const remove = async (id) => {
  const [result] = await db.query(
    "DELETE FROM prescriptions WHERE prescription_id = ?",
    [id]
  );

  return result.affectedRows > 0;
};

module.exports = {
  getById,
  getAll,
  getMedicalRecordById,
  create,
  update,
  remove,
};