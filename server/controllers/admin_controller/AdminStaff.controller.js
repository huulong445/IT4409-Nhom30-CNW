const staffModel = require("../../models/admin_model/AdminStaff.model");

const STAFF_ROLES = [
  "ADMIN",
  "DOCTOR",
  "RECEPTIONIST",
  "LAB_TECH",
];

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
      "Tài khoản đã có hồ sơ nhân viên hoặc chứng chỉ hành nghề đã tồn tại"
    );
  }

  if (error.code === "ER_NO_REFERENCED_ROW_2") {
    return fail(
      res,
      409,
      "Tài khoản hoặc khoa/phòng ban không còn tồn tại"
    );
  }

  if (error.code === "ER_ROW_IS_REFERENCED_2") {
    return fail(
      res,
      409,
      "Không thể xóa nhân viên đang được dữ liệu nghiệp vụ tham chiếu"
    );
  }

  console.error("AdminStaff:", error.message);

  return fail(res, 500, "Lỗi server khi xử lý hồ sơ nhân viên");
};

const validateBody = (body, creating) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Dữ liệu phải là một object" };
  }

  const data = {};

  if (!creating && body.user_id !== undefined) {
    return { error: "Không được thay đổi tài khoản của hồ sơ nhân viên" };
  }

  if (creating) {
    if (!validId(body.user_id)) {
      return { error: "user_id không hợp lệ" };
    }

    data.user_id = Number(body.user_id);
  }

  if (creating || body.department_id !== undefined) {
    if (!validId(body.department_id)) {
      return { error: "department_id không hợp lệ" };
    }

    data.department_id = Number(body.department_id);
  }

  if (creating || body.full_name !== undefined) {
    if (
      typeof body.full_name !== "string" ||
      !body.full_name.trim() ||
      [...body.full_name.trim()].length > 100
    ) {
      return {
        error: "full_name phải là chuỗi không rỗng, tối đa 100 ký tự",
      };
    }

    data.full_name = body.full_name.trim();
  }

  for (const field of ["title", "license_number"]) {
    if (body[field] === undefined) {
      continue;
    }

    if (body[field] !== null && typeof body[field] !== "string") {
      return { error: `${field} phải là chuỗi hoặc null` };
    }

    if (
      typeof body[field] === "string" &&
      [...body[field].trim()].length > 50
    ) {
      return { error: `${field} tối đa 50 ký tự` };
    }

    data[field] =
      body[field] === null ? null : body[field].trim() || null;
  }

  if (!creating && Object.keys(data).length === 0) {
    return { error: "Không có thông tin để cập nhật" };
  }

  return { data };
};

// GET /api/v1/admin/staff
const getAllStaff = async (req, res) => {
  const {
    page = "1",
    limit = "20",
    search = "",
    department_id,
    role,
  } = req.query;

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

  if (
    department_id !== undefined &&
    (typeof department_id !== "string" || !validId(department_id))
  ) {
    return fail(res, 400, "department_id không hợp lệ");
  }

  if (role !== undefined && !STAFF_ROLES.includes(role)) {
    return fail(res, 400, "Vai trò nhân viên không hợp lệ");
  }

  try {
    const result = await staffModel.getAll({
      search: search.trim(),
      departmentId:
        department_id === undefined ? undefined : Number(department_id),
      role,
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

// GET /api/v1/admin/staff/:id
const getStaffById = async (req, res) => {
  if (!validId(req.params.id)) {
    return fail(res, 400, "ID nhân viên không hợp lệ");
  }

  try {
    const staff = await staffModel.getById(Number(req.params.id));

    if (!staff) {
      return fail(res, 404, "Không tìm thấy nhân viên");
    }

    return res.json({
      success: true,
      data: staff,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// POST /api/v1/admin/staff
const createStaff = async (req, res) => {
  const { data, error } = validateBody(req.body, true);

  if (error) {
    return fail(res, 400, error);
  }

  try {
    const user = await staffModel.getUserById(data.user_id);

    if (!user) {
      return fail(res, 404, "Không tìm thấy tài khoản");
    }

    if (!STAFF_ROLES.includes(user.role)) {
      return fail(
        res,
        400,
        "Tài khoản phải có vai trò nhân viên, không được là PATIENT"
      );
    }

    if (!(await staffModel.departmentExists(data.department_id))) {
      return fail(res, 404, "Không tìm thấy khoa/phòng ban");
    }

    const staff = await staffModel.create(data);

    return res.status(201).json({
      success: true,
      message: "Tạo hồ sơ nhân viên thành công",
      data: staff,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// PUT /api/v1/admin/staff/:id
const updateStaff = async (req, res) => {
  if (!validId(req.params.id)) {
    return fail(res, 400, "ID nhân viên không hợp lệ");
  }

  const { data, error } = validateBody(req.body, false);

  if (error) {
    return fail(res, 400, error);
  }

  try {
    const id = Number(req.params.id);
    const currentStaff = await staffModel.getById(id);

    if (!currentStaff) {
      return fail(res, 404, "Không tìm thấy nhân viên");
    }

    if (
      data.department_id !== undefined &&
      !(await staffModel.departmentExists(data.department_id))
    ) {
      return fail(res, 404, "Không tìm thấy khoa/phòng ban");
    }

    const staff = await staffModel.update(id, data);

    if (!staff) {
      return fail(res, 404, "Không tìm thấy nhân viên");
    }

    return res.json({
      success: true,
      message: "Cập nhật hồ sơ nhân viên thành công",
      data: staff,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// DELETE /api/v1/admin/staff/:id
const deleteStaff = async (req, res) => {
  if (!validId(req.params.id)) {
    return fail(res, 400, "ID nhân viên không hợp lệ");
  }

  try {
    const deleted = await staffModel.remove(Number(req.params.id));

    if (!deleted) {
      return fail(res, 404, "Không tìm thấy nhân viên");
    }

    return res.json({
      success: true,
      message: "Xóa hồ sơ nhân viên thành công",
    });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
};