const express = require("express");
const router = express.Router();

// Import các controllers
const labRequestController = require("../controllers/doctor_controller/LabRequest.controller");
const medicalRecordController = require("../controllers/doctor_controller/MedicalRecord.controller");
const prescriptionController = require("../controllers/doctor_controller/Prescription.controller");
const doctorController = require("../controllers/doctor_controller/WaitingPatients.controller");

// Middleware xác thực
const { verifyToken } = require("../middleware/auth.middleware");

// ==========================================
// 1. ROUTES CHO LAB REQUESTS (Cận lâm sàng)
// ==========================================
router.post("/lab-requests", labRequestController.CreateLabRequest);
router.get("/lab-requests", labRequestController.GetLabRequests);
router.put("/lab-requests/:lab_request_id", verifyToken, labRequestController.UpdateLabRequest);
router.delete("/lab-requests/:lab_request_id", verifyToken, labRequestController.DeleteLabRequest);


// ==========================================
// 2. ROUTES CHO MEDICAL RECORDS (Bệnh án điện tử)
// ==========================================
router.post("/medical-records", verifyToken, medicalRecordController.CreateMedicalRecord);
router.get("/medical-records/:record_id", verifyToken, medicalRecordController.GetMedicalRecordById);
router.get("/medical-records/patient/:patient_id", verifyToken, medicalRecordController.GetMedicalRecordsByPatient);
router.put("/medical-records/:record_id", verifyToken, medicalRecordController.UpdateMedicalRecord);
router.delete("/medical-records/:record_id", verifyToken, medicalRecordController.DeleteMedicalRecord);


// ==========================================
// 3. ROUTES CHO PRESCRIPTIONS (Đơn thuốc)
// ==========================================
router.post("/prescriptions", verifyToken, prescriptionController.CreatePrescription);
router.get("/prescriptions/:record_id", prescriptionController.GetPrescriptionByRecord);
router.put("/prescriptions/:prescription_id", verifyToken, prescriptionController.UpdatePrescription);
router.delete("/prescriptions/:prescription_id", verifyToken, prescriptionController.DeletePrescription);


// ==========================================
// 4. ROUTES CHO DOCTOR (Bác sĩ - Bệnh nhân chờ khám)
// ==========================================
router.get("/appointments", doctorController.GetWaitingPatients);

module.exports = router;