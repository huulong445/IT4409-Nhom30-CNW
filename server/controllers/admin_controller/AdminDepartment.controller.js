const departmentModel = require("../../models/admin_model/AdminDepartment.model");

const validId = (value) => /^[1-9]\d*$/.test(String(value)) && Number(value) <= 2147483647;
const fail = (res, status, message) => res.status(status).json({ success: false, message });

const handleError = (res, error) => {
  if (error.code === "ER_DUP_ENTRY") return fail(res, 409, "Mã khoa/phòng ban đã tồn tại");
  if (error.code === "ER_ROW_IS_REFERENCED_2") {
    return fail(res, 409, "Không thể xóa khoa/phòng ban đang có nhân viên tham chiếu");
  }
  console.error("AdminDepartment:", error.message);
  return fail(res, 500, "Lỗi server khi xử lý khoa/phòng ban");
};

const validateBody = (body, creating) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Dữ liệu phải là một object" };
  }
  const data = {};
  for (const [field, max] of [["code", 20], ["department_name", 100]]) {
    if (creating || body[field] !== undefined) {
      if (typeof body[field] !== "string" || !body[field].trim() || [...body[field].trim()].length > max) {
        return { error: `${field} phải là chuỗi không rỗng, tối đa ${max} ký tự` };
      }
      data[field] = body[field].trim();
    }
  }
  if (body.description !== undefined) {
    if (body.description !== null && typeof body.description !== "string") {
      return { error: "description phải là chuỗi hoặc null" };
    }
    if (typeof body.description === "string" && Buffer.byteLength(body.description, "utf8") > 65535) {
      return { error: "description vượt giới hạn TEXT (65535 byte)" };
    }
    data.description = body.description === null ? null : body.description.trim();
  }
  if (!creating && !Object.keys(data).length) return { error: "Không có thông tin để cập nhật" };
  return { data };
};

const getAllDepartments = async (req, res) => {
  const { page = "1", limit = "20", search = "" } = req.query;
  if (typeof page !== "string" || typeof limit !== "string" ||
      !validId(page) || !validId(limit) || Number(limit) > 100 || typeof search !== "string") {
    return fail(res, 400, "page phải là số nguyên dương, limit từ 1 đến 100, search phải là chuỗi");
  }
  try {
    const result = await departmentModel.getAll({ search: search.trim(), limit: Number(limit), offset: (Number(page) - 1) * Number(limit) });
    return res.json({ success: true, data: result.rows, pagination: { page: Number(page), limit: Number(limit), total: result.total, total_pages: Math.ceil(result.total / Number(limit)) } });
  } catch (error) { return handleError(res, error); }
};

const getDepartmentById = async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 400, "ID khoa/phòng ban không hợp lệ");
  try {
    const data = await departmentModel.getById(Number(req.params.id));
    if (!data) return fail(res, 404, "Không tìm thấy khoa/phòng ban");
    return res.json({ success: true, data });
  } catch (error) { return handleError(res, error); }
};

const createDepartment = async (req, res) => {
  const { data, error } = validateBody(req.body, true);
  if (error) return fail(res, 400, error);
  try {
    const department = await departmentModel.create(data);
    return res.status(201).json({ success: true, message: "Tạo khoa/phòng ban thành công", data: department });
  } catch (error) { return handleError(res, error); }
};

const updateDepartment = async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 400, "ID khoa/phòng ban không hợp lệ");
  const { data, error } = validateBody(req.body, false);
  if (error) return fail(res, 400, error);
  try {
    const id = Number(req.params.id);
    if (!await departmentModel.getById(id)) return fail(res, 404, "Không tìm thấy khoa/phòng ban");
    const department = await departmentModel.update(id, data);
    if (!department) return fail(res, 404, "Không tìm thấy khoa/phòng ban");
    return res.json({ success: true, message: "Cập nhật khoa/phòng ban thành công", data: department });
  } catch (error) { return handleError(res, error); }
};

const deleteDepartment = async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 400, "ID khoa/phòng ban không hợp lệ");
  try {
    if (!await departmentModel.remove(Number(req.params.id))) return fail(res, 404, "Không tìm thấy khoa/phòng ban");
    return res.json({ success: true, message: "Xóa khoa/phòng ban thành công" });
  } catch (error) { return handleError(res, error); }
};

module.exports = { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment };
