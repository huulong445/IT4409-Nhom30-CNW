import PrescriptionModel from '../models/prescriptionModel.js';

// POST /api/prescriptions
export const CreatePrescription = async (req, res) => {
    try {
        const { record_id, doctor_id, medication_details } = req.body;

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

// GET /api/prescriptions/:record_id
export const GetPrescriptionByRecord = async (req, res) => {
    try {
        const { record_id } = req.params;
        const prescription = await PrescriptionModel.getByRecordId(record_id);

        if (!prescription) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn thuốc" });
        }

        return res.status(200).json({ success: true, data: prescription });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/prescriptions/:prescription_id
export const UpdatePrescription = async (req, res) => {
    try {
        const { prescription_id } = req.params;
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
export const DeletePrescription = async (req, res) => {
    try {
        const { prescription_id } = req.params;
        const result = await PrescriptionModel.remove(prescription_id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn thuốc để xóa" });
        }

        return res.status(200).json({ success: true, message: "Xóa đơn thuốc thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};