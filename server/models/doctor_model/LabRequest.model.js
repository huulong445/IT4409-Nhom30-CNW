const db = require('../config/db'); // Đường dẫn đến file cấu hình database của bạn

const LabRequestModel = {
    create: async ({ record_id, patient_id, doctor_id, test_type }) => {
        const query = `
            INSERT INTO lab_requests (record_id, patient_id, doctor_id, test_type, status)
            VALUES (?, ?, ?, ?, 'Pending')
        `;
        const [result] = await db.query(query, [record_id, patient_id, doctor_id, test_type]);
        return result;
    },

    getByFilters: async ({ record_id, patient_id }) => {
        let query = `SELECT * FROM lab_requests WHERE 1=1`;
        const params = [];

        if (record_id) {
            query += ` AND record_id = ?`;
            params.push(record_id);
        }
        if (patient_id) {
            query += ` AND patient_id = ?`;
            params.push(patient_id);
        }

        const [rows] = await db.query(query, params);
        return rows;
    },

    update: async (lab_request_id, { test_type, status }) => {
        const query = `UPDATE lab_requests SET test_type = ?, status = ? WHERE lab_request_id = ?`;
        const [result] = await db.query(query, [test_type, status, lab_request_id]);
        return result;
    },

    remove: async (lab_request_id) => {
        const query = `DELETE FROM lab_requests WHERE lab_request_id = ?`;
        const [result] = await db.query(query, [lab_request_id]);
        return result;
    }
};

export default LabRequestModel; // Hoặc dùng module.exports nếu dự án dùng CommonJS