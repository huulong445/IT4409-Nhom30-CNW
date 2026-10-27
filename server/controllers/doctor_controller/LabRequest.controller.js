const LabRequestModel = require('../../models/doctor_model/LabRequest.model.js');

// POST /api/lab-requests
exports.CreateLabRequest = async (req, res) => {
    try {
        const { record_id, patient_id, doctor_id, test_type } = req.body;
        const result = await LabRequestModel.create({ record_id, patient_id, doctor_id, test_type });

        return res.status(201).json({
            success: true,
            message: "Tạo chỉ định cận lâm sàng thành công",
            lab_request_id: result.insertId
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/lab-requests?record_id=... hoặc ?patient_id=...
exports.GetLabRequests = async (req, res) => {
    try {
        const { record_id, patient_id } = req.query;
        
        if (!record_id && !patient_id) {
            return res.status(400).json({ success: false, message: "Cần cung cấp record_id hoặc patient_id để tra cứu" });
        }

        const rows = await LabRequestModel.getByFilters({ record_id, patient_id });
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/lab-requests/:lab_request_id
exports.UpdateLabRequest = async (req, res) => {
    try {
        const { lab_request_id } = req.params;
        const { test_type, status } = req.body;
        
        const result = await LabRequestModel.update(lab_request_id, { test_type, status });

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy yêu cầu CLS" });
        }
        
        return res.status(200).json({ success: true, message: "Cập nhật yêu cầu CLS thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/lab-requests/:lab_request_id
exports.DeleteLabRequest = async (req, res) => {
    try {
        const { lab_request_id } = req.params;
        const result = await LabRequestModel.remove(lab_request_id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy yêu cầu CLS để xóa" });
        }
        
        return res.status(200).json({ success: true, message: "Xóa yêu cầu CLS thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};