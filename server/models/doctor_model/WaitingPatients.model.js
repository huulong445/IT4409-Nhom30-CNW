const db = require('../../config/db.config.js');

// Các hàm cũ (nếu có)...

const getWaitingPatientsByDoctorAndDate = async (doctor_id, date) => {
    const query = `
        SELECT 
            a.appointment_id, 
            a.appointment_date, 
            a.appointment_time, 
            a.status,
            a.room_id,
            a.created_at,
            p.patient_id, 
            p.full_name, 
            p.dob, 
            p.gender, 
            p.insurance_number
        FROM appointments a
        JOIN patients p ON a.patient_id = p.patient_id
        WHERE a.doctor_id = ? 
          AND a.appointment_date = ?
        ORDER BY a.appointment_time ASC, a.created_at ASC
    `;
    const [rows] = await db.query(query, [doctor_id, date]);
    return rows;
};

module.exports = {
    getWaitingPatientsByDoctorAndDate
};