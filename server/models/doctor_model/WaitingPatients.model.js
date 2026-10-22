const db = require("../config/db.config");

// Các hàm cũ (nếu có)...

export const getWaitingPatientsByDoctorAndDate = async (doctor_id, date) => {
    const query = `
        SELECT a.appointment_id, a.queue_number, a.time_slot, a.status, 
               p.patient_id, p.full_name, p.dob, p.gender, p.insurance_number
        FROM appointments a
        JOIN patients p ON a.patient_id = p.patient_id
        WHERE a.doctor_id = ? AND DATE(a.appointment_date) = ?
        ORDER BY a.queue_number ASC, a.time_slot ASC
    `;
    const [rows] = await db.query(query, [doctor_id, date]);
    return rows;
};