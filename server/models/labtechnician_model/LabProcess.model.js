
const db = require('../../config/db.config.js');

const LabProcessModel = {
    // Nhập kết quả xét nghiệm
    create: async ({
        lab_request_id,
        lab_tech_id,
        result_data,
        attachment_url
    }) => {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            // Khóa bản ghi chỉ định trong quá trình xử lý
            const [requests] = await connection.query(
                `
                SELECT status
                FROM lab_requests
                WHERE lab_request_id = ?
                FOR UPDATE
                `,
                [lab_request_id]
            );

            if (requests.length === 0) {
                throw new Error('Không tìm thấy chỉ định xét nghiệm');
            }

            if (requests[0].status !== 'PROCESSING') {
                throw new Error(
                    'Chỉ định phải ở trạng thái PROCESSING mới được nhập kết quả'
                );
            }

            // Kiểm tra chỉ định đã có kết quả hay chưa
            const [existingResults] = await connection.query(
                `
                SELECT result_id
                FROM lab_results
                WHERE lab_request_id = ?
                `,
                [lab_request_id]
            );

            if (existingResults.length > 0) {
                throw new Error('Chỉ định này đã có kết quả xét nghiệm');
            }

            // Thêm kết quả xét nghiệm
            const [result] = await connection.query(
                `
                INSERT INTO lab_results
                (
                    lab_request_id,
                    lab_tech_id,
                    result_data,
                    attachment_url
                )
                VALUES (?, ?, ?, ?)
                `,
                [
                    lab_request_id,
                    lab_tech_id,
                    JSON.stringify(result_data),
                    attachment_url || null
                ]
            );

            // Cập nhật trạng thái chỉ định
            await connection.query(
                `
                UPDATE lab_requests
                SET status = 'COMPLETED'
                WHERE lab_request_id = ?
                `,
                [lab_request_id]
            );

            await connection.commit();

            return result;

        } catch (error) {
            await connection.rollback();
            throw error;

        } finally {
            connection.release();
        }
    },

    // Lấy kết quả xét nghiệm theo mã chỉ định
    getByRequestId: async (lab_request_id) => {
        const query = `
            SELECT
                lr.result_id,
                lr.lab_request_id,
                lr.lab_tech_id,
                lr.result_data,
                lr.attachment_url,
                lr.completed_at,
                s.full_name AS lab_tech_name
            FROM lab_results lr
            LEFT JOIN staff s
                ON lr.lab_tech_id = s.staff_id
            WHERE lr.lab_request_id = ?
        `;

        const [rows] = await db.query(query, [lab_request_id]);

        return rows[0] || null;
    },

    // Cập nhật kết quả xét nghiệm
    update: async (
        result_id,
        { result_data, attachment_url }
    ) => {
        // Kiểm tra kết quả có tồn tại không
        const [existingResults] = await db.query(
            `
            SELECT result_id
            FROM lab_results
            WHERE result_id = ?
            `,
            [result_id]
        );

        if (existingResults.length === 0) {
            return null;
        }

        const query = `
            UPDATE lab_results
            SET result_data = ?,
                attachment_url = ?
            WHERE result_id = ?
        `;

        const [result] = await db.query(query, [
            JSON.stringify(result_data),
            attachment_url || null,
            result_id
        ]);

        return result;
    },

    // Chuyển trạng thái chỉ định từ REQUESTED sang PROCESSING
updateStatusToProcessing: async (lab_request_id) => {
    const query = `
        UPDATE lab_requests
        SET status = 'PROCESSING'
        WHERE lab_request_id = ?
          AND status = 'REQUESTED'
    `;

    const [result] = await db.query(query, [lab_request_id]);

    if (result.affectedRows === 0) {
        // Kiểm tra chỉ định có tồn tại không
        const [requests] = await db.query(
            `
            SELECT status
            FROM lab_requests
            WHERE lab_request_id = ?
            `,
            [lab_request_id]
        );

        if (requests.length === 0) {
            throw new Error('Không tìm thấy chỉ định xét nghiệm');
        }

        throw new Error(
            `Không thể chuyển trạng thái. Trạng thái hiện tại: ${requests[0].status}`
        );
    }

    return result;
}
};

module.exports = LabProcessModel;
