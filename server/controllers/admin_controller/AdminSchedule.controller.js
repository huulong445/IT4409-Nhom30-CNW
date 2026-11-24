const scheduleModel = require("../../models/admin_model/AdminSchedule.model");

const fail = (res, status, message) => res.status(status).json({ success: false, message });
const validId = (value) => /^(?:[1-9]\d*)$/.test(String(value)) && Number(value) <= 2147483647;
const validDate = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;

const getAssignments = async (req, res) => {
  const { page = "1", limit = "20", staff_id, department_id, room_id, from, to } = req.query;
  if (!validId(page) || !validId(limit) || Number(limit) > 100) return fail(res, 400, "page/limit không hợp lệ (limit tối đa 100)");
  for (const [key, value] of [["staff_id", staff_id], ["department_id", department_id], ["room_id", room_id]]) if (value !== undefined && !validId(value)) return fail(res, 400, `${key} không hợp lệ`);
  if ((from !== undefined && !validDate(from)) || (to !== undefined && !validDate(to))) return fail(res, 400, "from/to phải có định dạng YYYY-MM-DD hợp lệ");
  if (from && to && from > to) return fail(res, 400, "from không được sau to");
  try {
    const result = await scheduleModel.getAll({ staffId: staff_id && Number(staff_id), departmentId: department_id && Number(department_id), roomId: room_id && Number(room_id), from, to, limit: Number(limit), offset: (Number(page) - 1) * Number(limit) });
    return res.json({ success: true, data: result.rows, pagination: { page: Number(page), limit: Number(limit), total: result.total, total_pages: Math.ceil(result.total / Number(limit)) } });
  } catch (error) { console.error("AdminSchedule:", error.message); return fail(res, 500, "Lỗi server khi lấy lịch làm việc"); }
};

const getAssignment = async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 400, "ID lịch làm việc không hợp lệ");
  try { const row = await scheduleModel.getById(Number(req.params.id)); return row ? res.json({ success: true, data: row }) : fail(res, 404, "Không tìm thấy lịch làm việc"); }
  catch (error) { console.error("AdminSchedule:", error.message); return fail(res, 500, "Lỗi server khi lấy lịch làm việc"); }
};

const getCatalog = async (req, res) => {
  try { return res.json({ success: true, data: await (req.path.endsWith("shifts") ? scheduleModel.getShifts() : scheduleModel.getRooms()) }); }
  catch (error) { console.error("AdminSchedule:", error.message); return fail(res, 500, "Lỗi server khi lấy danh mục lịch làm việc"); }
};

const saveAssignment = async (req, res, creating) => {
  const id = creating ? undefined : Number(req.params.id);
  if (!creating && !validId(req.params.id)) return fail(res, 400, "ID lịch làm việc không hợp lệ");
  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) return fail(res, 400, "Dữ liệu phải là object");
  const fields = ["staff_id", "shift_id", "room_id", "work_date"];
  const data = {};
  for (const field of fields) {
    if (creating || body[field] !== undefined) {
      const value = body[field];
      if (field === "work_date" ? !validDate(value) : !validId(value)) return fail(res, 400, `${field} không hợp lệ`);
      data[field] = field === "work_date" ? value : Number(value);
    }
  }
  if (!creating && Object.keys(data).length === 0) return fail(res, 400, "Không có thông tin để cập nhật");
  try {
    if (!creating && !(await scheduleModel.getById(id))) return fail(res, 404, "Không tìm thấy lịch làm việc");
    for (const [field, table] of [["staff_id", "staff"], ["shift_id", "shifts"], ["room_id", "rooms"]]) {
      if (data[field] !== undefined && !(await scheduleModel.exists(table, data[field]))) return fail(res, 404, `Không tìm thấy ${field}`);
    }
    const current = creating ? {} : await scheduleModel.getById(id);
    const merged = { staff_id: data.staff_id ?? current.staff_id, shift_id: data.shift_id ?? current.shift_id, work_date: data.work_date ?? (typeof current.work_date === "string" ? current.work_date.slice(0, 10) : current.work_date.toISOString().slice(0, 10)) };
    if (await scheduleModel.hasConflict({ ...merged, excludeId: id })) return fail(res, 409, "Nhân viên đã có ca làm bị trùng thời gian trong ngày này");
    const row = creating ? await scheduleModel.create(data) : await scheduleModel.update(id, data);
    return res.status(creating ? 201 : 200).json({ success: true, message: creating ? "Tạo lịch làm việc thành công" : "Cập nhật lịch làm việc thành công", data: row });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return fail(res, 409, "Lịch làm việc này đã tồn tại");
    console.error("AdminSchedule:", error.message); return fail(res, 500, "Lỗi server khi lưu lịch làm việc");
  }
};

const createAssignment = (req, res) => saveAssignment(req, res, true);
const updateAssignment = (req, res) => saveAssignment(req, res, false);
const deleteAssignment = async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 400, "ID lịch làm việc không hợp lệ");
  try { return await scheduleModel.remove(Number(req.params.id)) ? res.json({ success: true, message: "Xóa lịch làm việc thành công" }) : fail(res, 404, "Không tìm thấy lịch làm việc"); }
  catch (error) { console.error("AdminSchedule:", error.message); return fail(res, 500, "Lỗi server khi xóa lịch làm việc"); }
};

module.exports = { getAssignments, getAssignment, getCatalog, createAssignment, updateAssignment, deleteAssignment };
