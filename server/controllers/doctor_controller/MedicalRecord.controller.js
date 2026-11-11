const MedicalRecordModel = require('../../models/doctor_model/MedicalRecord.model.js');

// POST /api/medical-records
exports.CreateMedicalRecord = async (req, res) => {
    try {
        const { appointment_id, patient_id, doctor_id, symptoms, diagnosis_icd10, notes } = req.body;

        const result = await MedicalRecordModel.create({
            appointment_id,
            patient_id,
            doctor_id,
            symptoms,
            diagnosis_icd10,
            notes
        });

        return res.status(201).json({
            success: true,
            message: "Tạo bệnh án điện tử thành công",
            record_id: result.insertId
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/medical-records/:record_id
exports.GetMedicalRecordById = async (req, res) => {
    try {
        const { record_id } = req.params;
        const record = await MedicalRecordModel.getById(record_id);

        if (!record) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bệnh án" });
        }

        return res.status(200).json({ success: true, data: record });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/medical-records/patient/:patient_id
exports.GetMedicalRecordsByPatient = async (req, res) => {
    try {
        const { patient_id } = req.params;
        const records = await MedicalRecordModel.getByPatientId(patient_id);

        return res.status(200).json({ 
            success: true, 
            count: records.length, 
            data: records 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/medical-records/:record_id
exports.UpdateMedicalRecord = async (req, res) => {
    try {
        const { record_id } = req.params;
        const { symptoms, diagnosis_icd10, notes } = req.body;

        const result = await MedicalRecordModel.update(record_id, { symptoms, diagnosis_icd10, notes });

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bệnh án để cập nhật" });
        }

        return res.status(200).json({ success: true, message: "Cập nhật bệnh án thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/medical-records/:record_id
exports.DeleteMedicalRecord = async (req, res) => {
    try {
        const { record_id } = req.params;
        const result = await MedicalRecordModel.remove(record_id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bệnh án để xóa" });
        }

        return res.status(200).json({ success: true, message: "Xóa bệnh án thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};