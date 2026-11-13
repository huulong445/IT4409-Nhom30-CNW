const patientModel = require("../models/patient.model");

const createPatient = async (req, res) => {
  const body = req.body;
  const allowedFields = [
    "full_name",
    "dob",
    "gender",
    "address",
    "identity_card",
    "insurance_number",
  ];

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu hồ sơ bệnh nhân không hợp lệ",
    });
  }

  const unsupportedFields = Object.keys(body).filter(
    (field) => !allowedFields.includes(field),
  );
  if (unsupportedFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Không hỗ trợ các trường: ${unsupportedFields.join(", ")}`,
    });
  }

  const { full_name, dob, gender } = body;
  if (typeof full_name !== "string" || !full_name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập họ tên bệnh nhân",
    });
  }
  if (full_name.trim().length > 100) {
    return res.status(400).json({
      success: false,
      message: "Họ tên không được vượt quá 100 ký tự",
    });
  }

  if (typeof dob !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    return res.status(400).json({
      success: false,
      message: "Ngày sinh phải có định dạng YYYY-MM-DD",
    });
  }
  const parsedDob = new Date(`${dob}T00:00:00.000Z`);
  const today = new Date().toISOString().slice(0, 10);
  if (
    Number.isNaN(parsedDob.getTime()) ||
    parsedDob.toISOString().slice(0, 10) !== dob ||
    dob < "1000-01-01" ||
    dob > today
  ) {
    return res.status(400).json({
      success: false,
      message: "Ngày sinh không hợp lệ",
    });
  }

  if (!["MALE", "FEMALE", "OTHER"].includes(gender)) {
    return res.status(400).json({
      success: false,
      message: "Giới tính phải là MALE, FEMALE hoặc OTHER",
    });
  }

  const optionalTextFields = ["address", "identity_card", "insurance_number"];
  const patientData = {
    user_id: req.user.user_id,
    full_name: full_name.trim(),
    dob,
    gender,
  };

  for (const field of optionalTextFields) {
    const value = body[field];
    if (value === undefined || value === null || value === "") {
      patientData[field] = null;
      continue;
    }

    if (typeof value !== "string") {
      return res.status(400).json({
        success: false,
        message: `${field} phải là chuỗi`,
      });
    }

    const normalizedValue = value.trim();
    if (field !== "address" && normalizedValue.length > 20) {
      return res.status(400).json({
        success: false,
        message: `${field} không được vượt quá 20 ký tự`,
      });
    }

    patientData[field] = normalizedValue || null;
  }

  try {
    const patient = await patientModel.createPatient(patientData);

    if (!patient) {
      throw new Error("Patient was inserted but could not be retrieved");
    }

    return res.status(201).json({
      success: true,
      message: "Tạo hồ sơ bệnh nhân thành công",
      data: patient,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Số CCCD/VNeID hoặc số BHYT đã được sử dụng",
      });
    }

    console.error("createPatient:", error.message);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo hồ sơ bệnh nhân",
    });
  }
};

module.exports = { createPatient };
