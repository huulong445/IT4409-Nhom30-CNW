const PrescriptionModel = require('../../models/doctor_model/Prescription.model.js');

// POST /api/prescriptions
// POST /api/prescriptions
exports.CreatePrescription = async (req, res) => {
    try {
        const { record_id, doctor_id, medication_details } = req.body;

        // Kiểm tra dữ liệu đầu vào cơ bản
        if (!record_id || !doctor_id) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu thông tin record_id hoặc doctor_id" 
            });
        }

        if (!Array.isArray(medication_details) || medication_details.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Danh sách thuốc (medication_details) không hợp lệ hoặc rỗng" 
            });
        }

        const result = await PrescriptionModel.create({
            record_id,
            doctor_id,
            medication_details
        });

        return res.status(201).json({
            success: true,
            message: "Kê đơn thuốc thành công",
            prescription_id: result.insertId
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/prescriptions
exports.GetPrescriptionByRecord = async (req, res) => {
    try {
        const { record_id, patient_id } = req.query;

        // Kiểm tra xem người dùng có truyền ít nhất 1 trong 2 tham số không
        if (!record_id && !patient_id) {
            return res.status(400).json({ 
                success: false, 
                message: "Cần cung cấp record_id hoặc patient_id để tra cứu" 
            });
        }

        const prescriptions = await PrescriptionModel.getByFilters({ record_id, patient_id });

        if (!prescriptions || prescriptions.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn thuốc" });
        }

        return res.status(200).json({ 
            success: true, 
            count: prescriptions.length, 
            data: prescriptions 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/prescriptions/:prescription_id
exports.UpdatePrescription = async (req, res) => {
    try {
        const { prescription_id } = req.query;
        const { medication_details } = req.body;

        const result = await PrescriptionModel.update(prescription_id, { medication_details });

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn thuốc để cập nhật" });
        }

        return res.status(200).json({ success: true, message: "Cập nhật đơn thuốc thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/prescriptions/:prescription_id
exports.DeletePrescription = async (req, res) => {
    try {
        const { prescription_id } = req.query;
        const result = await PrescriptionModel.remove(prescription_id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn thuốc để xóa" });
        }

        return res.status(200).json({ success: true, message: "Xóa đơn thuốc thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};