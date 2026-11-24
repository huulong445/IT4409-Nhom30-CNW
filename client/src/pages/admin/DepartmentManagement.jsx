import { useEffect, useState } from "react";
import { Building2, Pencil, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import api from "../../services/api";

const EMPTY_FORM = { code: "", department_name: "", description: "" };

function getErrorMessage(error) {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.status === 502) {
    return "Không kết nối được backend (localhost:5000). Vui lòng kiểm tra lại khi backend hoạt động.";
  }
  return error.message || "Đã xảy ra lỗi khi gọi API.";
}

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    async function fetchDepartments() {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/admin/departments", {
          params: { page, limit: 20, search: query },
        });
        if (!response.data?.success || !Array.isArray(response.data?.data)) {
          throw new Error("Dữ liệu danh sách khoa phòng không hợp lệ.");
        }
        if (!active) return;
        setDepartments(response.data.data);
        setTotal(response.data.pagination?.total ?? response.data.data.length);
        setTotalPages(Math.max(1, response.data.pagination?.total_pages || 1));
      } catch (err) {
        if (!active) return;
        setDepartments([]);
        setTotal(0);
        setTotalPages(1);
        setError(getErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchDepartments();
    return () => { active = false; };
  }, [page, query, refreshKey]);

  const reload = () => setRefreshKey((value) => value + 1);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setQuery(searchInput.trim());
    reload();
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = async (id) => {
    setFormError("");
    setError("");
    setBusy(true);
    try {
      const response = await api.get(`/admin/departments/${id}`);
      if (!response.data?.success || !response.data?.data) {
        throw new Error("Không lấy được chi tiết khoa phòng.");
      }
      const department = response.data.data;
      setEditingId(id);
      setForm({
        code: department.code ?? "",
        department_name: department.department_name ?? "",
        description: department.description ?? "",
      });
      setModalOpen(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setFormError("");
    setNotice("");
    const payload = {
      code: form.code.trim(),
      department_name: form.department_name.trim(),
      description: form.description.trim() || null,
    };
    try {
      const response = editingId === null
        ? await api.post("/admin/departments", payload)
        : await api.put(`/admin/departments/${editingId}`, payload);
      if (!response.data?.success) {
        throw new Error(response.data?.message || "Không thể lưu khoa phòng.");
      }
      setModalOpen(false);
      setNotice(editingId === null ? "Đã tạo khoa phòng thành công." : "Đã cập nhật khoa phòng thành công.");
      if (page !== 1 && editingId === null) setPage(1);
      else reload();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (department) => {
    if (busy) return;
    if (!window.confirm(`Xóa khoa phòng "${department.department_name}"? Thao tác này không thể hoàn tác.`)) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await api.delete(`/admin/departments/${department.department_id}`);
      if (!response.data?.success) {
        throw new Error(response.data?.message || "Không thể xóa khoa phòng.");
      }
      setNotice("Đã xóa khoa phòng thành công.");
      if (departments.length === 1 && page > 1) setPage((value) => value - 1);
      else reload();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
            <Building2 className="text-[#004282]" /> Quản lý khoa phòng
          </h1>
          <p className="mt-1 text-sm text-slate-500">Danh mục khoa phòng từ hệ thống backend</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={reload} disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm disabled:opacity-50">
            <RefreshCw size={16} /> Làm mới
          </button>
          <button type="button" onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-[#004282] px-4 py-2 text-sm font-semibold text-white">
            <Plus size={16} /> Thêm khoa phòng
          </button>
        </div>
      </div>

      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {notice && <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</div>}

      <form onSubmit={handleSearch} className="flex gap-2 rounded-xl border border-slate-200 bg-white p-4">
        <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Tìm theo mã hoặc tên khoa phòng"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <button type="submit" className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium">
          <Search size={16} /> Tìm
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-4">Mã khoa</th>
              <th className="p-4">Tên khoa phòng</th>
              <th className="p-4">Mô tả</th>
              <th className="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500">Đang tải dữ liệu...</td></tr>
            ) : departments.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500">
                {error ? "Không tải được dữ liệu khoa phòng." : "Không tìm thấy khoa phòng."}
              </td></tr>
            ) : departments.map((department) => (
              <tr key={department.department_id} className="border-t border-slate-100">
                <td className="p-4 font-mono font-semibold text-[#004282]">{department.code}</td>
                <td className="p-4 font-medium">{department.department_name}</td>
                <td className="p-4 text-slate-600">{department.description || "—"}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button type="button" disabled={busy} onClick={() => openEdit(department.department_id)}
                      className="flex items-center gap-1 rounded-lg border border-blue-200 px-3 py-1.5 text-blue-700 disabled:opacity-50"
                      aria-label={`Sửa ${department.department_name}`}>
                      <Pencil size={14} /> Sửa
                    </button>
                    <button type="button" disabled={busy} onClick={() => handleDelete(department)}
                      className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-red-700 disabled:opacity-50"
                      aria-label={`Xóa ${department.department_name}`}>
                      <Trash2 size={14} /> Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
        <span>Tổng số khoa phòng: {total}</span>
        <div className="flex items-center gap-3">
          <button type="button" disabled={loading || page <= 1} onClick={() => setPage((value) => value - 1)}
            className="rounded-lg border px-3 py-1.5 disabled:opacity-40">Trước</button>
          <span>Trang {page}/{totalPages}</span>
          <button type="button" disabled={loading || page >= totalPages} onClick={() => setPage((value) => value + 1)}
            className="rounded-lg border px-3 py-1.5 disabled:opacity-40">Sau</button>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between rounded-t-2xl bg-[#004282] p-4 text-white">
              <h2 className="font-bold">{editingId === null ? "Thêm khoa phòng" : "Chỉnh sửa khoa phòng"}</h2>
              <button type="button" disabled={busy} onClick={() => setModalOpen(false)} aria-label="Đóng form">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 p-5">
              {formError && <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</div>}
              <label className="block text-sm font-medium text-slate-700">
                Mã khoa phòng
                <input required maxLength={20} value={form.code}
                  onChange={(e) => setForm((value) => ({ ...value, code: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Tên khoa phòng
                <input required maxLength={100} value={form.department_name}
                  onChange={(e) => setForm((value) => ({ ...value, department_name: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Mô tả
                <textarea rows={3} value={form.description}
                  onChange={(e) => setForm((value) => ({ ...value, description: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" disabled={busy} onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Hủy</button>
                <button type="submit" disabled={busy}
                  className="rounded-lg bg-[#004282] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                  {busy ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}