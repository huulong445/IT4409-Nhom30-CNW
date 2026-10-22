const db = require("../config/db.config");

const PrescriptionModel = {
    create: async ({ record_id, doctor_id, medication_details }) => {
        const query = `
            INSERT INTO prescriptions (record_id, doctor_id, medication_details)
            VALUES (?, ?, ?)
        `;
        const [result] = await db.query(query, [
            record_id, 
            doctor_id, 
            JSON.stringify(medication_details)
        ]);
        return result;
    },

    getByRecordId: async (record_id) => {
        const [rows] = await db.query(`SELECT * FROM prescriptions WHERE record_id = ?`, [record_id]);
        return rows[0];
    },

    update: async (prescription_id, { medication_details }) => {
        const query = `UPDATE prescriptions SET medication_details = ? WHERE prescription_id = ?`;
        const [result] = await db.query(query, [
            JSON.stringify(medication_details), 
            prescription_id
        ]);
        return result;
    },

    remove: async (prescription_id) => {
        const [result] = await db.query(`DELETE FROM prescriptions WHERE prescription_id = ?`, [prescription_id]);
        return result;
    }
};

export default PrescriptionModel;