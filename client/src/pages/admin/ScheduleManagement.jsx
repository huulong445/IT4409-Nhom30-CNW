import { useCallback, useEffect, useState } from "react";
import { Calendar, Pencil, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import api from "../../services/api";

const EMPTY_FORM = {
  staff_id: "",
  shift_id: "",
  room_id: "",
  work_date: "",
};

const formatDate = (value) => {
  if (!value) return "—";
  return String(value).slice(0, 10);
};

const getError = (err, fallback) =>
  err.response?.data?.message || err.message || fallback;

export default function ScheduleManagement() {
  const [schedules, setSchedules] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [filters, setFilters] = useState({
    staff_id: "",
    department_id: "",
    room_id: "",
    from: "",
    to: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Load catalogs: shifts, rooms, staff, departments
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.get("/admin/schedules/shifts"),
      api.get("/admin/schedules/rooms"),
      api.get("/admin/staff", { params: { page: 1, limit: 100 } }),
      api.get("/admin/departments", { params: { page: 1, limit: 100 } }),
    ])
      .then(([shiftsRes, roomsRes, staffRes, deptRes]) => {
        if (cancelled) return;
        if (shiftsRes.data?.success && Array.isArray(shiftsRes.data.data)) {
          setShifts(shiftsRes.data.data);
        }
        if (roomsRes.data?.success && Array.isArray(roomsRes.data.data)) {
          setRooms(roomsRes.data.data);
        }
        if (staffRes.data?.success && Array.isArray(staffRes.data.data)) {
          setStaffList(staffRes.data.data);
        }
        if (deptRes.data?.success && Array.isArray(deptRes.data.data)) {
          setDepartments(deptRes.data.data);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(getError(err, "Không thể tải danh mục ca trực / phòng / nhân sự."));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadSchedules = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = { page, limit: 20 };
    for (const key of ["staff_id", "department_id", "room_id", "from", "to"]) {
      if (appliedFilters[key]) {
        params[key] = appliedFilters[key];
      }
    }
    try {
      const res = await api.get("/admin/schedules", { params });
      if (!res.data?.success || !Array.isArray(res.data?.data)) {
        throw new Error(res.data?.message || "Dữ liệu lịch làm việc không hợp lệ.");
      }
      setSchedules(res.data.data);
      setTotal(res.data.pagination?.total ?? res.data.data.length);
      setTotalPages(Math.max(1, res.data.pagination?.total_pages || 1));
    } catch (err) {
      setSchedules([]);
      setError(getError(err, "Không thể tải danh sách lịch làm việc."));
    } finally {
      setLoading(false);
    }
  }, [page, appliedFilters, refreshKey]);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  const reload = () => setRefreshKey((v) => v + 1);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setPage(1);
    setAppliedFilters({
      staff_id: filters.staff_id || undefined,
      department_id: filters.department_id || undefined,
      room_id: filters.room_id || undefined,
      from: filters.from || undefined,
      to: filters.to || undefined,
    });
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = async (id) => {
    setBusy(true);
    setError("");
    setFormError("");
    try {
      const res = await api.get(`/admin/schedules/${id}`);
      if (!res.data?.success || !res.data?.data) {
        throw new Error("Không lấy được chi tiết lịch làm việc.");
      }
      const item = res.data.data;
      setEditingId(item.staff_shift_id);
      setForm({
        staff_id: String(item.staff_id || ""),
        shift_id: String(item.shift_id || ""),
        room_id: String(item.room_id || ""),
        work_date: formatDate(item.work_date),
      });
      setModalOpen(true);
    } catch (err) {
      setError(getError(err, "Không thể tải chi tiết ca trực."));
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (busy) return;
    setFormError("");
    setNotice("");

    const payload = {
      staff_id: Number(form.staff_id),
      shift_id: Number(form.shift_id),
      room_id: Number(form.room_id),
      work_date: form.work_date,
    };
    if (!payload.staff_id || !payload.shift_id || !payload.room_id || !payload.work_date) {
      setFormError("Vui lòng chọn đầy đủ nhân viên, ca trực, phòng và ngày làm việc.");
      return;
    }

    setBusy(true);
    try {
      const res =
        editingId === null
          ? await api.post("/admin/schedules", payload)
          : await api.put(`/admin/schedules/${editingId}`, payload);
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Không thể lưu lịch làm việc.");
      }
      setModalOpen(false);
      setNotice(
        editingId === null
          ? "Đã tạo lịch làm việc thành công."
          : `Đã cập nhật lịch làm việc #${editingId}.`
      );
      reload();
    } catch (err) {
      setFormError(getError(err, "Không thể lưu lịch làm việc."));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (item) => {
    if (busy) return;
    if (!window.confirm(`Xóa lịch trực #${item.staff_shift_id} của ${item.full_name}?`)) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const res = await api.delete(`/admin/schedules/${item.staff_shift_id}`);
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Không thể xóa lịch làm việc.");
      }
      setNotice(`Đã xóa lịch trực #${item.staff_shift_id}.`);
      reload();
    } catch (err) {
      setError(getError(err, "Không thể xóa lịch làm việc."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
            <Calendar className="text-[#004282]" /> Quản lý lịch làm việc & phân ca
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Phân công ca trực, phòng khám và quản lý lịch làm việc nhân viên y tế
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={reload}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm disabled:opacity-50"
          >
            <RefreshCw size={16} /> Làm mới
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-[#004282] px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus size={16} /> Phân ca mới
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      {notice && (
        <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {notice}
        </div>
      )}

      {/* Bộ lọc */}
      <form onSubmit={handleApplyFilters} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-6 items-end">
        <label className="text-xs font-medium text-slate-700">
          Nhân viên
          <select
            value={filters.staff_id}
            onChange={(e) => setFilters((p) => ({ ...p, staff_id: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs"
          >
            <option value="">Tất cả nhân viên</option>
            {staffList.map((s) => (
              <option key={s.staff_id} value={s.staff_id}>
                {s.full_name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-slate-700">
          Khoa/Phòng
          <select
            value={filters.department_id}
            onChange={(e) => setFilters((p) => ({ ...p, department_id: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs"
          >
            <option value="">Tất cả khoa</option>
            {departments.map((d) => (
              <option key={d.department_id} value={d.department_id}>
                {d.department_name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-slate-700">
          Phòng trực
          <select
            value={filters.room_id}
            onChange={(e) => setFilters((p) => ({ ...p, room_id: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs"
          >
            <option value="">Tất cả phòng</option>
            {rooms.map((r) => (
              <option key={r.room_id} value={r.room_id}>
                {r.room_number} - {r.room_name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-slate-700">
          Từ ngày
          <input
            type="date"
            value={filters.from}
            onChange={(e) => setFilters((p) => ({ ...p, from: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-xs"
          />
        </label>
        <label className="text-xs font-medium text-slate-700">
          Đến ngày
          <input
            type="date"
            value={filters.to}
            onChange={(e) => setFilters((p) => ({ ...p, to: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-xs"
          />
        </label>
        <button
          type="submit"
          className="flex items-center justify-center gap-1.5 rounded-lg bg-[#004282] px-4 py-2 text-xs font-semibold text-white"
        >
          <Search size={14} /> Lọc lịch
        </button>
      </form>

      {/* Bảng lịch làm việc */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Ngày trực</th>
              <th className="p-4">Nhân viên</th>
              <th className="p-4">Khoa</th>
              <th className="p-4">Ca trực</th>
              <th className="p-4">Phòng</th>
              <th className="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-8 text-center text-slate-500">Đang tải dữ liệu...</td></tr>
            ) : schedules.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-slate-500">Không có lịch làm việc nào.</td></tr>
            ) : (
              schedules.map((item) => (
                <tr key={item.staff_shift_id} className="border-t border-slate-100">
                  <td className="p-4 font-mono">{item.staff_shift_id}</td>
                  <td className="p-4 font-semibold text-[#004282]">{formatDate(item.work_date)}</td>
                  <td className="p-4 font-medium">{item.full_name}</td>
                  <td className="p-4 text-slate-600">{item.department_name}</td>
                  <td className="p-4">
                    {item.shift_name} ({String(item.start_time).slice(0, 5)}–{String(item.end_time).slice(0, 5)})
                  </td>
                  <td className="p-4">{item.room_number} - {item.room_name}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => openEdit(item.staff_shift_id)}
                        className="flex items-center gap-1 rounded-lg border border-blue-200 px-3 py-1.5 text-blue-700 disabled:opacity-50"
                      >
                        <Pencil size={14} /> Sửa
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleDelete(item)}
                        className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-red-700 disabled:opacity-50"
                      >
                        <Trash2 size={14} /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Tổng số ca phân công: {total}</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={loading || page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border px-3 py-1.5 disabled:opacity-40"
          >
            Trước
          </button>
          <span>Trang {page}/{totalPages}</span>
          <button
            type="button"
            disabled={loading || page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border px-3 py-1.5 disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between rounded-t-2xl bg-[#004282] p-4 text-white">
              <h2 className="font-bold">{editingId === null ? "Phân ca làm việc mới" : `Chỉnh sửa lịch trực #${editingId}`}</h2>
              <button type="button" disabled={busy} onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 p-5 text-sm">
              {formError && <div role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{formError}</div>}
              <label className="block font-medium text-slate-700">
                Nhân viên y tế *
                <select
                  required
                  value={form.staff_id}
                  onChange={(e) => setForm((p) => ({ ...p, staff_id: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                >
                  <option value="">Chọn nhân viên</option>
                  {staffList.map((s) => (
                    <option key={s.staff_id} value={s.staff_id}>
                      {s.full_name} ({s.department_name})
                    </option>
                  ))}
                </select>
              </label>
              <label className="block font-medium text-slate-700">
                Ca trực *
                <select
                  required
                  value={form.shift_id}
                  onChange={(e) => setForm((p) => ({ ...p, shift_id: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                >
                  <option value="">Chọn ca trực</option>
                  {shifts.map((sh) => (
                    <option key={sh.shift_id} value={sh.shift_id}>
                      {sh.shift_name} ({String(sh.start_time).slice(0, 5)} - {String(sh.end_time).slice(0, 5)})
                    </option>
                  ))}
                </select>
              </label>
              <label className="block font-medium text-slate-700">
                Phòng làm việc *
                <select
                  required
                  value={form.room_id}
                  onChange={(e) => setForm((p) => ({ ...p, room_id: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                >
                  <option value="">Chọn phòng</option>
                  {rooms.map((r) => (
                    <option key={r.room_id} value={r.room_id}>
                      {r.room_number} — {r.room_name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block font-medium text-slate-700">
                Ngày làm việc *
                <input
                  required
                  type="date"
                  value={form.work_date}
                  onChange={(e) => setForm((p) => ({ ...p, work_date: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" disabled={busy} onClick={() => setModalOpen(false)} className="rounded-lg border px-4 py-2">
                  Hủy
                </button>
                <button type="submit" disabled={busy} className="rounded-lg bg-[#004282] px-4 py-2 font-semibold text-white disabled:opacity-50">
                  {busy ? "Đang lưu..." : "Lưu lịch trực"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
