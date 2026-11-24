// Sửa tên biến Require thành LabResultModel
const LabResultModel = require('../../models/doctor_model/LabResult.model.js');

// GET /api/v1/doctor/lab-results?lab_request_id=...
exports.GetLabResultById = async (req, res) => {
    try {
        const { lab_request_id } = req.query;

        if (!lab_request_id) {
            return res.status(400).json({ 
                success: false, 
                message: "Cần cung cấp lab_request_id" 
            });
        }

        const labResult = await LabResultModel.getByLabRequestId(lab_request_id);

        if (!labResult) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy yêu cầu cận lâm sàng này" 
            });
        }

        // Kiểm tra xem đã có kết quả từ phòng Lab trả về chưa
        if (!labResult.result_id) {
            return res.status(200).json({
                success: true,
                is_completed: false,
                message: "Xét nghiệm đang chờ xử lý, chưa có kết quả",
                data: labResult
            });
        }

        return res.status(200).json({
            success: true,
            is_completed: true,
            message: "Lấy kết quả cận lâm sàng thành công",
            data: labResult
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
