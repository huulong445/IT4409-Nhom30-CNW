const prescriptionModel = require(
  "../../models/admin_model/AdminPrescription.model"
);

const validId = (value) =>
  (typeof value === "string" || typeof value === "number") &&
  /^[1-9]\d*$/.test(String(value)) &&
  Number(value) <= 2147483647;

const fail = (res, status, message) =>
  res.status(status).json({
    success: false,
    message,
  });

const handleError = (res, error) => {
  if (error.code === "ER_DUP_ENTRY") {
    return fail(
      res,
      409,
      "Bệnh án này đã có đơn thuốc"
    );
  }

  if (error.code === "ER_NO_REFERENCED_ROW_2") {
    return fail(
      res,
      409,
      "Bệnh án hoặc bác sĩ không còn tồn tại"
    );
  }

  console.error("AdminPrescription:", error.message);

  return fail(res, 500, "Lỗi server khi xử lý đơn thuốc");
};

const validateMedicationDetails = (medicationDetails) => {
  if (
    !Array.isArray(medicationDetails) ||
    medicationDetails.length === 0
  ) {
    return {
      error: "medication_details phải là mảng và có ít nhất một thuốc",
    };
  }

  if (medicationDetails.length > 50) {
    return {
      error: "Một đơn thuốc chỉ được chứa tối đa 50 loại thuốc",
    };
  }

  const medicines = [];

  for (let index = 0; index < medicationDetails.length; index += 1) {
    const medicine = medicationDetails[index];

    if (
      !medicine ||
      typeof medicine !== "object" ||
      Array.isArray(medicine)
    ) {
      return {
        error: `Thuốc ở vị trí ${index + 1} không hợp lệ`,
      };
    }

    if (
      typeof medicine.name !== "string" ||
      !medicine.name.trim() ||
      medicine.name.trim().length > 150
    ) {
      return {
        error: `name của thuốc thứ ${index + 1} phải là chuỗi không rỗng, tối đa 150 ký tự`,
      };
    }

    if (
      typeof medicine.dosage !== "string" ||
      !medicine.dosage.trim() ||
      medicine.dosage.trim().length > 100
    ) {
      return {
        error: `dosage của thuốc thứ ${index + 1} phải là chuỗi không rỗng, tối đa 100 ký tự`,
      };
    }

    if (
      typeof medicine.quantity !== "number" ||
      !Number.isSafeInteger(medicine.quantity) ||
      medicine.quantity <= 0 ||
      medicine.quantity > 10000
    ) {
      return {
        error: `quantity của thuốc thứ ${index + 1} phải là số nguyên từ 1 đến 10000`,
      };
    }

    if (
      medicine.note !== undefined &&
      medicine.note !== null &&
      typeof medicine.note !== "string"
    ) {
      return {
        error: `note của thuốc thứ ${index + 1} phải là chuỗi hoặc null`,
      };
    }

    if (
      typeof medicine.note === "string" &&
      medicine.note.trim().length > 500
    ) {
      return {
        error: `note của thuốc thứ ${index + 1} tối đa 500 ký tự`,
      };
    }

    medicines.push({
      name: medicine.name.trim(),
      dosage: medicine.dosage.trim(),
      quantity: medicine.quantity,
      note:
        medicine.note === undefined || medicine.note === null
          ? null
          : medicine.note.trim() || null,
    });
  }

  return { data: medicines };
};

// GET /api/v1/admin/prescriptions
const getAllPrescriptions = async (req, res) => {
  const {
    page = "1",
    limit = "20",
    patient_id,
    doctor_id,
    record_id,
  } = req.query;

  if (
    typeof page !== "string" ||
    typeof limit !== "string" ||
    !validId(page) ||
    !validId(limit) ||
    Number(limit) > 100
  ) {
    return fail(
      res,
      400,
      "page phải là số nguyên dương và limit từ 1 đến 100"
    );
  }

  for (const [name, value] of [
    ["patient_id", patient_id],
    ["doctor_id", doctor_id],
    ["record_id", record_id],
  ]) {
    if (
      value !== undefined &&
      (typeof value !== "string" || !validId(value))
    ) {
      return fail(res, 400, `${name} không hợp lệ`);
    }
  }

  try {
    const result = await prescriptionModel.getAll({
      patientId:
        patient_id === undefined ? undefined : Number(patient_id),
      doctorId:
        doctor_id === undefined ? undefined : Number(doctor_id),
      recordId:
        record_id === undefined ? undefined : Number(record_id),
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
    });

    return res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        total_pages: Math.ceil(result.total / Number(limit)),
      },
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// GET /api/v1/admin/prescriptions/:id
const getPrescriptionById = async (req, res) => {
  if (!validId(req.params.id)) {
    return fail(res, 400, "ID đơn thuốc không hợp lệ");
  }

  try {
    const prescription = await prescriptionModel.getById(
      Number(req.params.id)
    );

    if (!prescription) {
      return fail(res, 404, "Không tìm thấy đơn thuốc");
    }

    return res.json({
      success: true,
      data: prescription,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// POST /api/v1/admin/prescriptions
const createPrescription = async (req, res) => {
  if (!validId(req.body?.record_id)) {
    return fail(res, 400, "record_id không hợp lệ");
  }

  const validation = validateMedicationDetails(
    req.body?.medication_details
  );

  if (validation.error) {
    return fail(res, 400, validation.error);
  }

  try {
    const record = await prescriptionModel.getMedicalRecordById(
      Number(req.body.record_id)
    );

    if (!record) {
      return fail(res, 404, "Không tìm thấy bệnh án");
    }

    // Bác sĩ kê đơn phải là bác sĩ phụ trách bệnh án.
    const prescription = await prescriptionModel.create({
      record_id: record.record_id,
      doctor_id: record.doctor_id,
      medication_details: validation.data,
    });

    return res.status(201).json({
      success: true,
      message: "Tạo đơn thuốc thành công",
      data: prescription,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// PUT /api/v1/admin/prescriptions/:id
const updatePrescription = async (req, res) => {
  if (!validId(req.params.id)) {
    return fail(res, 400, "ID đơn thuốc không hợp lệ");
  }

  const validation = validateMedicationDetails(
    req.body?.medication_details
  );

  if (validation.error) {
    return fail(res, 400, validation.error);
  }

  try {
    const id = Number(req.params.id);

    if (!(await prescriptionModel.getById(id))) {
      return fail(res, 404, "Không tìm thấy đơn thuốc");
    }

    const prescription = await prescriptionModel.update(
      id,
      validation.data
    );

    return res.json({
      success: true,
      message: "Cập nhật đơn thuốc thành công",
      data: prescription,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// DELETE /api/v1/admin/prescriptions/:id
const deletePrescription = async (req, res) => {
  if (!validId(req.params.id)) {
    return fail(res, 400, "ID đơn thuốc không hợp lệ");
  }

  try {
    const deleted = await prescriptionModel.remove(
      Number(req.params.id)
    );

    if (!deleted) {
      return fail(res, 404, "Không tìm thấy đơn thuốc");
    }

    return res.json({
      success: true,
      message: "Xóa đơn thuốc thành công",
    });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = {
  getAllPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
};