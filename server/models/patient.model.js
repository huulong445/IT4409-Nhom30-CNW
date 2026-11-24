const db = require("../config/db.config");

const createPatient = async ({
  user_id,
  full_name,
  dob,
  gender,
  address,
  identity_card,
  insurance_number,
}) => {
  const [result] = await db.query(
    `INSERT INTO patients
      (user_id, full_name, dob, gender, address, identity_card, insurance_number)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      user_id,
      full_name,
      dob,
      gender,
      address,
      identity_card,
      insurance_number,
    ],
  );

  const [rows] = await db.query(
    `SELECT patient_id, user_id, full_name, dob, gender, address,
            identity_card, insurance_number, created_at
     FROM patients
     WHERE patient_id = ?`,
    [result.insertId],
  );

  return rows[0] || null;
};

const getPatientsByUserId = async (user_id) => {
  const [rows] = await db.query(
    `SELECT patient_id, user_id, full_name, dob, gender, address,
            identity_card, insurance_number, created_at
     FROM patients
     WHERE user_id = ?
     ORDER BY created_at DESC, patient_id DESC`,
    [user_id],
  );

  return rows;
};

module.exports = { createPatient, getPatientsByUserId };