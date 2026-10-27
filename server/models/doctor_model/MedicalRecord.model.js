const db = require('../../config/db.config.js');

const MedicalRecordModel = {
    create: async ({ appointment_id, patient_id, doctor_id, symptoms, diagnosis_icd10, notes }) => {
        const query = `
            INSERT INTO medical_records (appointment_id, patient_id, doctor_id, symptoms, diagnosis_icd10, notes)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [appointment_id, patient_id, doctor_id, symptoms, diagnosis_icd10, notes]);
        return result;
    },

    getById: async (record_id) => {
        const [rows] = await db.query(`SELECT * FROM medical_records WHERE record_id = ?`, [record_id]);
        return rows[0];
    },

    // Thêm hàm lấy lịch sử bệnh án theo patient_id
    getByPatientId: async (patient_id) => {
        const [rows] = await db.query(
            `SELECT * FROM medical_records WHERE patient_id = ? ORDER BY created_at DESC`, 
            [patient_id]
        );
        return rows;
    },

    update: async (record_id, { symptoms, diagnosis_icd10, notes }) => {
        const query = `UPDATE medical_records SET symptoms = ?, diagnosis_icd10 = ?, notes = ? WHERE record_id = ?`;
        const [result] = await db.query(query, [symptoms, diagnosis_icd10, notes, record_id]);
        return result;
    },

    remove: async (record_id) => {
        const [result] = await db.query(`DELETE FROM medical_records WHERE record_id = ?`, [record_id]);
        return result;
    }
};
module.exports = MedicalRecordModel;