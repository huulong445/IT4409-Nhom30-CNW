
const db = require('../../config/db.config.js');

const LabRequestModel = {
    // Bác sĩ tạo chỉ định xét nghiệm
    create: async ({ record_id, patient_id, doctor_id, test_type }) => {
        const query = `
            INSERT INTO lab_requests
            (record_id, patient_id, doctor_id, test_type, status)
            VALUES (?, ?, ?, ?, 'REQUESTED')
        `;

        const [result] = await db.query(query, [
            record_id,
            patient_id,
            doctor_id,
            test_type
        ]);

        return result;
    },

    // Lấy danh sách chỉ định theo bộ lọc
    getByFilters: async ({ record_id, patient_id, doctor_id, status, full_name }) => {
    let query = `
        SELECT 
            lr.*,
            mr.appointment_id,
            p.full_name,
            p.dob,
            p.gender,
            p.insurance_number,
            s.full_name AS doctor_name,
            a.appointment_date,
            a.appointment_time,
            a.room_id
        FROM lab_requests lr
        JOIN medical_records mr 
            ON lr.record_id = mr.record_id
        JOIN appointments a 
            ON mr.appointment_id = a.appointment_id
        JOIN patients p 
            ON lr.patient_id = p.patient_id
        JOIN staff s 
            ON lr.doctor_id = s.staff_id
        WHERE 1=1
    `;

    const params = [];

    if (record_id) {
        query += ` AND lr.record_id = ?`;
        params.push(record_id);
    }

    if (patient_id) {
        query += ` AND lr.patient_id = ?`;
        params.push(patient_id);
    }

    if (doctor_id) {
        query += ` AND lr.doctor_id = ?`;
        params.push(doctor_id);
    }

    if (status) {
        query += ` AND lr.status = ?`;
        params.push(status);
    }

    if (full_name) {
        query += ` AND p.full_name LIKE ?`;
        params.push(`%${full_name}%`);
    }

    query += ` ORDER BY lr.created_at DESC`;

    const [rows] = await db.query(query, params);
    return rows;
},
    // Lấy chi tiết một chỉ định xét nghiệm
    getById: async (lab_request_id) => {
        const query = `
            SELECT *
            FROM lab_requests
            WHERE lab_request_id = ?
        `;

        const [rows] = await db.query(query, [lab_request_id]);
        return rows[0] || null;
    },

    // Cập nhật chỉ định xét nghiệm
    update: async (lab_request_id, { test_type, status }) => {
        const query = `
            UPDATE lab_requests
            SET test_type = ?, status = ?
            WHERE lab_request_id = ?
        `;

        const [result] = await db.query(query, [
            test_type,
            status,
            lab_request_id
        ]);

        return result;
    },

    // Chuyển trạng thái REQUESTED -> PROCESSING
    processSample: async (lab_request_id) => {
        const query = `
            UPDATE lab_requests
            SET status = 'PROCESSING'
            WHERE lab_request_id = ?
            AND status = 'REQUESTED'
        `;

        const [result] = await db.query(query, [lab_request_id]);
        return result;
    },

    // Xóa chỉ định xét nghiệm
    remove: async (lab_request_id) => {
        const query = `
            DELETE FROM lab_requests
            WHERE lab_request_id = ?
        `;

        const [result] = await db.query(query, [lab_request_id]);
        return result;
    }
};

module.exports = LabRequestModel;
