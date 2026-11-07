const db = require('../../config/db.config.js');

const PrescriptionModel = {
    create: async ({ record_id, doctor_id, medication_details }) => {
    // 1. Lấy connection từ pool để thực thi Transaction
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        // 2. Thêm mới bản ghi vào bảng prescriptions
        const insertPrescriptionQuery = `
            INSERT INTO prescriptions (record_id, doctor_id)
            VALUES (?, ?)
        `;
        const [prescriptionResult] = await connection.query(insertPrescriptionQuery, [
            record_id, 
            doctor_id
        ]);

        const prescription_id = prescriptionResult.insertId;

        // 3. Chuẩn bị dữ liệu chèn hàng loạt (Bulk Insert) vào bảng prescription_details
        if (Array.isArray(medication_details) && medication_details.length > 0) {
            const insertDetailsQuery = `
                INSERT INTO prescription_details (prescription_id, med_id, quantity, unit_price, dosage, note)
                VALUES ?
            `;

            // Biến đổi mảng object thành mảng các mảng giá trị [prescription_id, med_id, quantity, unit_price, dosage, note]
            const values = medication_details.map(item => [
                prescription_id,
                item.med_id,
                item.quantity,
                item.unit_price,
                item.dosage,
                item.note || null
            ]);

            await connection.query(insertDetailsQuery, [values]);
        }

        // 4. Xác nhận lưu toàn bộ dữ liệu vào DB
        await connection.commit();
        
        return { insertId: prescription_id };
    } catch (error) {
        // Hoàn tác nếu xảy ra bất kỳ lỗi nào trong quá trình chèn
        await connection.rollback();
        throw error;
    } finally {
        // Giải phóng connection về lại pool
        connection.release();
    }
},

getByFilters: async ({ record_id, patient_id }) => {
    let query = `
        SELECT 
            p.*,
            IF(
                COUNT(pd.detail_id) > 0,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'detail_id', pd.detail_id,
                        'med_id', pd.med_id,
                        'med_name', m.name, -- Giả sử bảng medicine có cột name (nếu muốn lấy tên thuốc)
                        'quantity', pd.quantity,
                        'unit_price', pd.unit_price,
                        'dosage', pd.dosage,
                        'note', pd.note
                    )
                ),
                JSON_ARRAY()
            ) AS details
        FROM prescriptions p
        LEFT JOIN medical_records mr ON p.record_id = mr.record_id
        LEFT JOIN prescription_details pd ON p.prescription_id = pd.prescription_id
        LEFT JOIN medicine m ON pd.med_id = m.med_id
        WHERE 1=1
    `;
    const params = [];

    if (record_id) {
        query += ` AND p.record_id = ?`;
        params.push(record_id);
    }

    if (patient_id) {
        query += ` AND mr.patient_id = ?`;
        params.push(patient_id);
    }

    query += ` GROUP BY p.prescription_id`;

    const [rows] = await db.query(query, params);
    
    // Ép kiểu JSON nếu mysql/mysql2 driver trả về chuỗi JSON string
    return rows.map(row => ({
        ...row,
        details: typeof row.details === 'string' ? JSON.parse(row.details) : row.details
    }));
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

module.exports = PrescriptionModel;