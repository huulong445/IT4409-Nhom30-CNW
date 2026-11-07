const db = require('../../config/db.config.js');

// Model: Lấy kết quả xét nghiệm/hình ảnh theo lab_request_id
const getByLabRequestId = async (lab_request_id) => {
    const query = `
        SELECT 
            lr.result_id,
            lr.lab_request_id,
            req.patient_id,
            req.doctor_id,
            req.test_type,
            req.status AS request_status,
            lr.lab_tech_id,
            st.full_name AS lab_tech_name,
            lr.result_data,
            lr.attachment_url,
            lr.completed_at
        FROM lab_requests req
        LEFT JOIN lab_results lr ON req.lab_request_id = lr.lab_request_id
        LEFT JOIN staff st ON lr.lab_tech_id = st.staff_id
        WHERE req.lab_request_id = ?
    `;

    const [rows] = await db.query(query, [lab_request_id]);
    
    if (rows.length === 0) return null;

    const record = rows[0];

    // Parse dữ liệu JSON nếu mysql2 trả về chuỗi JSON string
    if (record.result_data && typeof record.result_data === 'string') {
        try {
            record.result_data = JSON.parse(record.result_data);
        } catch (e) {
            // Giữ nguyên nếu đã là object
        }
    }

    return record;
};

// Sửa chỗ này: Export dạng Object để Controller gọi LabResultModel.getByLabRequestId
module.exports = {
    getByLabRequestId
};