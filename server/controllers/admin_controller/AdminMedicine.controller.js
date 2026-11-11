const medicineModel = require("../../models/admin_model/AdminMedicine.model");

const validId = (value) =>
  (typeof value === "string" || typeof value === "number") &&
  /^[1-9]\d*$/.test(String(value)) &&
  Number(value) <= 2147483647;

const fail = (res, status, message) =>
  res.status(status).json({ success: false, message });

const handleError = (res, error) => {
  if (error.code === "ER_DUP_ENTRY") {
    return fail(res, 409, "Tên thuốc đã tồn tại");
  }

  if (error.code === "ER_ROW_IS_REFERENCED_2") {
    return fail(
      res,
      409,
      "Thuốc đã xuất hiện trong đơn thuốc nên không thể xóa"
    );
  }

  console.error("AdminMedicine:", error.message);
  return fail(res, 500, "Lỗi server khi xử lý thuốc");
};

const validNonNegativeInteger = (value) =>
  typeof value === "number" &&
  Number.isSafeInteger(value) &&
  value >= 0 &&
  value <= 2147483647;

const validateBody = (body, creating) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Dữ liệu phải là một object JSON" };
  }

  const data = {};

  if (creating || body.name !== undefined) {
    if (
      typeof body.name !== "string" ||
      !body.name.trim() ||
      [...body.name.trim()].length > 100
    ) {
      return { error: "name phải là chuỗi không rỗng, tối đa 100 ký tự" };
    }

    data.name = body.name.trim();
  }

  if (creating || body.unit !== undefined) {
    if (
      typeof body.unit !== "string" ||
      !body.unit.trim() ||
      [...body.unit.trim()].length > 50
    ) {
      return { error: "unit phải là chuỗi không rỗng, tối đa 50 ký tự" };
    }

    data.unit = body.unit.trim();
  }

  for (const field of ["unit_price", "quantity"]) {
    if (creating || body[field] !== undefined) {
      if (!validNonNegativeInteger(body[field])) {
        return { error: `${field} phải là số nguyên lớn hơn hoặc bằng 0` };
      }

      data[field] = body[field];
    }
  }

  if (creating || body.is_insurance_covered !== undefined) {
    if (typeof body.is_insurance_covered !== "boolean") {
      return { error: "is_insurance_covered phải là true hoặc false" };
    }

    data.is_insurance_covered = body.is_insurance_covered;
  }

  if (!creating && Object.keys(data).length === 0) {
    return { error: "Không có thông tin để cập nhật" };
  }

  return { data };
};

// GET /api/v1/admin/medicines
const getAllMedicines = async (req, res) => {
  const { page = "1", limit = "20", search = "" } = req.query;

  if (
    typeof page !== "string" ||
    typeof limit !== "string" ||
    !validId(page) ||
    !validId(limit) ||
    Number(limit) > 100 ||
    typeof search !== "string"
  ) {
    return fail(
      res,
      400,
      "page phải là số nguyên dương, limit từ 1 đến 100, search phải là chuỗi"
    );
  }

  try {
    const result = await medicineModel.getAll({
      search: search.trim(),
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

// GET /api/v1/admin/medicines/:id
const getMedicineById = async (req, res) => {
  if (!validId(req.params.id)) {
    return fail(res, 400, "ID thuốc không hợp lệ");
  }

  try {
    const medicine = await medicineModel.getById(Number(req.params.id));

    if (!medicine) {
      return fail(res, 404, "Không tìm thấy thuốc");
    }

    return res.json({ success: true, data: medicine });
  } catch (error) {
    return handleError(res, error);
  }
};

// POST /api/v1/admin/medicines
const createMedicine = async (req, res) => {
  const { data, error } = validateBody(req.body, true);

  if (error) return fail(res, 400, error);

  try {
    const medicine = await medicineModel.create(data);

    return res.status(201).json({
      success: true,
      message: "Tạo thuốc thành công",
      data: medicine,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// PUT /api/v1/admin/medicines/:id
const updateMedicine = async (req, res) => {
  if (!validId(req.params.id)) {
    return fail(res, 400, "ID thuốc không hợp lệ");
  }

  const { data, error } = validateBody(req.body, false);

  if (error) return fail(res, 400, error);

  try {
    const id = Number(req.params.id);

    if (!(await medicineModel.getById(id))) {
      return fail(res, 404, "Không tìm thấy thuốc");
    }

    const medicine = await medicineModel.update(id, data);

    return res.json({
      success: true,
      message: "Cập nhật thuốc thành công",
      data: medicine,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// DELETE /api/v1/admin/medicines/:id
const deleteMedicine = async (req, res) => {
  if (!validId(req.params.id)) {
    return fail(res, 400, "ID thuốc không hợp lệ");
  }

  try {
    const deleted = await medicineModel.remove(Number(req.params.id));

    if (!deleted) {
      return fail(res, 404, "Không tìm thấy thuốc");
    }

    return res.json({
      success: true,
      message: "Xóa thuốc thành công",
    });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = {
  getAllMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
};
