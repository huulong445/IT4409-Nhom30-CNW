import { useEffect, useState } from "react";
import { Pencil, Plus, RefreshCw, Search, Trash2, Users, X } from "lucide-react";
import api from "../../services/api";

const PAGE_SIZE = 20;
const STAFF_ROLES = ["ADMIN", "DOCTOR", "RECEPTIONIST", "LAB_TECH"];
const ROLE_NAMES = {
  ADMIN: "Quản trị viên",
  DOCTOR: "Bác sĩ",
  RECEPTIONIST: "Lễ tân",
  LAB_TECH: "Kỹ thuật viên",
};
const emptyForm = {
  user_id: "",
  department_id: "",
  full_name: "",
  title: "",
  license_number: "",
};
const getError = (err) =>
  err.response?.data?.message || err.message || "Đã xảy ra lỗi.";

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [optionsError, setOptionsError] = useState("");
  const [formError, setFormError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [modal, setModal] = useState(null); // null | "create" | "edit"
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/admin/staff", {
          params: { page, limit: PAGE_SIZE, search },
        });
        if (!res.data?.success || !Array.isArray(res.data?.data)) {
          throw new Error("Dữ liệu nhân sự không hợp lệ.");
        }
        if (!cancelled) {
          setStaff(res.data.data);
          setTotal(res.data.pagination?.total ?? res.data.data.length);
          setTotalPages(Math.max(1, res.data.pagination?.total_pages ?? 1));
        }
      } catch (err) {
        if (!cancelled) {
          setStaff([]);
          setError(getError(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [page, search, refreshKey]);

  useEffect(() => {
    let cancelled = false;
    const loadOptions = async () => {
      try {
        const [usersRes, deptRes] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/departments", { params: { page: 1, limit: 100 } }),
        ]);
        if (!usersRes.data?.success || !Array.isArray(usersRes.data?.data) ||
            !deptRes.data?.success || !Array.isArray(deptRes.data?.data)) {
          throw new Error("Không thể đọc danh sách tài khoản hoặc khoa phòng.");
        }
        if (!cancelled) {
          setAccounts(usersRes.data.data.filter((u) => STAFF_ROLES.includes(u.role)));
          setDepartments(deptRes.data.data);
          setOptionsError("");
        }
      } catch (err) {
        if (!cancelled) setOptionsError(getError(err));
      }
    };
    loadOptions();
    return () => { cancelled = true; };
  }, []);

  const reload = () => setRefreshKey((key) => key + 1);
  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const openCreate = () => {
    setForm({ ...emptyForm });
    setFormError("");
    setEditingId(null);
    setModal("create");
  };

  const openEdit = async (id) => {
    setBusy(true);
    setError("");
    try {
      const res = await api.get(`/admin/staff/${id}`);
      if (!res.data?.success || !res.data?.data) {
        throw new Error("Không tìm thấy hồ sơ nhân sự.");
      }
      const item = res.data.data;
      setForm({
        user_id: String(item.user_id),
        department_id: String(item.department_id),
        full_name: item.full_name || "",
        title: item.title || "",
        license_number: item.license_number || "",
      });
      setEditingId(item.staff_id);
      setFormError("");
      setModal("edit");
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  };

  const saveStaff = async (event) => {
    event.preventDefault();
    setFormError("");
    if (!form.full_name.trim() || !Number(form.department_id) ||
        (modal === "create" && !Number(form.user_id))) {
      setFormError("Vui lòng nhập họ tên và chọn tài khoản, khoa phòng hợp lệ.");
      return;
    }
    const payload = {
      department_id: Number(form.department_id),
      full_name: form.full_name.trim(),
      title: form.title.trim() || null,
      license_number: form.license_number.trim() || null,
    };
    if (modal === "create") payload.user_id = Number(form.user_id);

    setBusy(true);
    try {
      const res = modal === "create"
        ? await api.post("/admin/staff", payload)
        : await api.put(`/admin/staff/${editingId}`, payload);
      if (!res.data?.success) throw new Error(res.data?.message || "Không thể lưu nhân sự.");
      setModal(null);
      if (modal === "create") setPage(1);
      reload();
    } catch (err) {
      setFormError(getError(err));
    } finally {
      setBusy(false);
    }
  };

  const deleteStaff = async (item) => {
    if (!window.confirm(`Xóa hồ sơ nhân sự của "${item.full_name}"?\nThao tác này không xóa tài khoản đăng nhập.`)) return;
    setBusy(true);
    setError("");
    try {
      const res = await api.delete(`/admin/staff/${item.staff_id}`);
      if (!res.data?.success) throw new Error(res.data?.message || "Không thể xóa nhân sự.");
      if (page > 1 && staff.length === 1) setPage((p) => p - 1);
      reload();
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-[#004282]" /> Quản lý nhân sự
          </h1>
          <p className="text-sm text-slate-500 mt-1">Hồ sơ nhân viên và khoa phòng công tác</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reload} disabled={loading || busy}
            className="px-3 py-2 border rounded-lg bg-white disabled:opacity-50 flex items-center gap-2">
            <RefreshCw size={16} /> Làm mới
          </button>
          <button onClick={openCreate} disabled={busy}
            className="px-4 py-2 rounded-lg bg-[#004282] text-white disabled:opacity-50 flex items-center gap-2">
            <Plus size={16} /> Thêm nhân sự
          </button>
        </div>
      </div>

      {error && <div role="alert" className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">{error}</div>}
      <form onSubmit={(e) => { e.preventDefault(); setPage(1); setSearch(searchInput.trim()); }}
        className="flex gap-2 bg-white border rounded-xl p-3">
        <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Tìm theo họ tên nhân viên" aria-label="Tìm nhân sự"
          className="flex-1 min-w-0 px-3 py-2 border rounded-lg" />
        <button type="submit" className="px-4 py-2 bg-slate-100 rounded-lg flex items-center gap-2">
          <Search size={16} /> Tìm
        </button>
      </form>

      <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-4">Mã NV</th><th className="p-4">Họ tên</th>
              <th className="p-4">Tài khoản</th><th className="p-4">Vai trò</th>
              <th className="p-4">Khoa phòng</th><th className="p-4">Trạng thái</th>
              <th className="p-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-8 text-center">Đang tải...</td></tr>
            ) : staff.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-slate-500">
                {error ? "Không tải được dữ liệu." : "Không có nhân sự phù hợp."}
              </td></tr>
            ) : staff.map((item) => (
              <tr key={item.staff_id} className="border-t border-slate-100">
                <td className="p-4">{item.staff_id}</td>
                <td className="p-4 font-medium">{item.full_name}</td>
                <td className="p-4">{item.username}</td>
                <td className="p-4">{ROLE_NAMES[item.role] || item.role}</td>
                <td className="p-4">{item.department_name}</td>
                <td className="p-4">{item.is_active ? "Hoạt động" : "Đã khóa"}</td>
                <td className="p-4 whitespace-nowrap">
                  <button onClick={() => openEdit(item.staff_id)} disabled={busy}
                    title="Sửa nhân sự" className="p-2 text-blue-700 disabled:opacity-50">
                    <Pencil size={17} />
                  </button>
                  <button onClick={() => deleteStaff(item)} disabled={busy}
                    title="Xóa hồ sơ nhân sự" className="p-2 text-red-700 disabled:opacity-50">
                    <Trash2 size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Tổng số nhân sự: {total}</span>
        <div className="flex items-center gap-3">
          <button onClick={() => setPage((p) => p - 1)} disabled={page <= 1 || loading}
            className="px-3 py-1 border rounded disabled:opacity-40">Trước</button>
          <span>Trang {page}/{totalPages}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages || loading}
            className="px-3 py-1 border rounded disabled:opacity-40">Sau</button>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{modal === "create" ? "Thêm nhân sự" : "Sửa nhân sự"}</h2>
              <button onClick={() => setModal(null)} disabled={busy} aria-label="Đóng" className="p-2">
                <X size={20} />
              </button>
            </div>
            {optionsError && <div role="alert" className="mb-3 text-sm text-red-700">Không tải được danh sách chọn: {optionsError}</div>}
            {formError && <div role="alert" className="mb-3 p-3 bg-red-50 text-red-700 rounded-lg">{formError}</div>}
            <form onSubmit={saveStaff} className="space-y-4">
              <label className="block text-sm font-medium">Tài khoản nhân viên
                <select value={form.user_id} onChange={(e) => updateField("user_id", e.target.value)}
                  disabled={modal === "edit"} required className="block w-full mt-1 p-2 border rounded-lg disabled:bg-slate-100">
                  <option value="">Chọn tài khoản</option>
                  {accounts.map((item) => (
                    <option key={item.user_id} value={item.user_id}>
                      {item.username} ({ROLE_NAMES[item.role] || item.role})
                    </option>
                  ))}
                  {modal === "edit" && !accounts.some((item) => String(item.user_id) === form.user_id) && (
                    <option value={form.user_id}>User #{form.user_id}</option>
                  )}
                </select>
              </label>
              <label className="block text-sm font-medium">Họ và tên
                <input value={form.full_name} onChange={(e) => updateField("full_name", e.target.value)}
                  maxLength={100} required className="block w-full mt-1 p-2 border rounded-lg" />
              </label>
              <label className="block text-sm font-medium">Khoa phòng
                <select value={form.department_id} onChange={(e) => updateField("department_id", e.target.value)}
                  required className="block w-full mt-1 p-2 border rounded-lg">
                  <option value="">Chọn khoa phòng</option>
                  {departments.map((item) => (
                    <option key={item.department_id} value={item.department_id}>{item.department_name}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium">Chức danh
                <input value={form.title} onChange={(e) => updateField("title", e.target.value)}
                  maxLength={50} className="block w-full mt-1 p-2 border rounded-lg" />
              </label>
              <label className="block text-sm font-medium">Số chứng chỉ hành nghề
                <input value={form.license_number} onChange={(e) => updateField("license_number", e.target.value)}
                  maxLength={50} className="block w-full mt-1 p-2 border rounded-lg" />
              </label>
              <p className="text-xs text-slate-500">
                Tài khoản phải tồn tại và chưa có hồ sơ nhân sự. Không thể đổi tài khoản khi sửa hồ sơ.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModal(null)} disabled={busy}
                  className="px-4 py-2 border rounded-lg">Hủy</button>
                <button type="submit" disabled={busy}
                  className="px-4 py-2 bg-[#004282] text-white rounded-lg disabled:opacity-50">
                  {busy ? "Đang lưu..." : "Lưu nhân sự"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}