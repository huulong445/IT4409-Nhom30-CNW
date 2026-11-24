const db = require("../config/db.config");

const createAppointment = async ({
  patient_id,
  user_id,
  doctor_id,
  room_id,
  appointment_date,
  appointment_time,
}) => {
  const [patients] = await db.query(
    `SELECT patient_id
     FROM patients
     WHERE patient_id = ? AND user_id = ?
     LIMIT 1`,
    [patient_id, user_id],
  );

  if (patients.length === 0) {
    const error = new Error("PATIENT_NOT_FOUND");
    error.code = "PATIENT_NOT_FOUND";
    throw error;
  }

  const [shifts] = await db.query(
    `SELECT ss.staff_shift_id
     FROM staff_shifts ss
     JOIN shifts sh ON sh.shift_id = ss.shift_id
     JOIN rooms r ON r.room_id = ss.room_id
     JOIN staff s ON s.staff_id = ss.staff_id
     JOIN users u ON u.user_id = s.user_id
     WHERE ss.staff_id = ?
       AND ss.room_id = ?
       AND r.room_type = 'CLINIC'
       AND u.role = 'DOCTOR'
       AND u.is_active = TRUE
       AND (
         (ss.work_date = ?
           AND sh.start_time < sh.end_time
           AND ? >= sh.start_time AND ? < sh.end_time)
         OR
         (ss.work_date = ?
           AND sh.start_time > sh.end_time
           AND ? >= sh.start_time)
         OR
         (ss.work_date = DATE_SUB(?, INTERVAL 1 DAY)
           AND sh.start_time > sh.end_time
           AND ? < sh.end_time)
       )
     LIMIT 1`,
    [
      doctor_id,
      room_id,
      appointment_date,
      appointment_time,
      appointment_time,
      appointment_date,
      appointment_time,
      appointment_date,
      appointment_time,
    ],
  );

  if (shifts.length === 0) {
    const error = new Error("DOCTOR_SLOT_UNAVAILABLE");
    error.code = "DOCTOR_SLOT_UNAVAILABLE";
    throw error;
  }

  const [result] = await db.query(
    `INSERT INTO appointments
      (patient_id, doctor_id, room_id, appointment_date, appointment_time)
     VALUES (?, ?, ?, ?, ?)`,
    [patient_id, doctor_id, room_id, appointment_date, appointment_time],
  );

  const [appointments] = await db.query(
    `SELECT a.appointment_id, a.patient_id, p.full_name AS patient_name,
            a.doctor_id, s.full_name AS doctor_name, a.room_id, r.room_name,
            a.appointment_date, a.appointment_time, a.status, a.created_at
     FROM appointments a
     JOIN patients p ON p.patient_id = a.patient_id
     JOIN staff s ON s.staff_id = a.doctor_id
     JOIN rooms r ON r.room_id = a.room_id
     WHERE a.appointment_id = ?`,
    [result.insertId],
  );

  return appointments[0] || null;
};

const getDoctorAvailabilityByDate = async (appointment_date) => {
  const [rows] = await db.query(
    `SELECT ss.staff_id AS doctor_id,
            s.full_name AS doctor_name,
            d.department_name,
            ss.room_id,
            r.room_name,
            sh.start_time,
            sh.end_time
     FROM staff_shifts ss
     JOIN shifts sh ON sh.shift_id = ss.shift_id
     JOIN rooms r ON r.room_id = ss.room_id
     JOIN departments d ON d.department_id = r.department_id
     JOIN staff s ON s.staff_id = ss.staff_id
     JOIN users u ON u.user_id = s.user_id
     WHERE ss.work_date = ?
       AND r.room_type = 'CLINIC'
       AND u.role = 'DOCTOR'
       AND u.is_active = TRUE
     ORDER BY d.department_name, s.full_name, sh.start_time`,
    [appointment_date],
  );

  return rows;
};

module.exports = { createAppointment, getDoctorAvailabilityByDate };
