import { useCallback, useEffect, useState } from "react";
import { Pill, Pencil, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import api from "../../services/api";

const EMPTY_FORM = {
  name: "",
  unit: "Viên",
  unit_price: 0,
  quantity: 0,
  is_insurance_covered: true,
};

const getError = (err, fallback) =>
  err.response?.data?.message || err.message || fallback;

export default function MedicineManagement() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  const loadMedicines = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/medicines", {
        params: { page, limit: 20, search },
      });
      if (!res.data?.success || !Array.isArray(res.data?.data)) {
        throw new Error(res.data?.message || "Dữ liệu thuốc không hợp lệ.");
      }
      setMedicines(res.data.data);
      setTotal(res.data.pagination?.total ?? res.data.data.length);
      setTotalPages(Math.max(1, res.data.pagination?.total_pages || 1));
    } catch (err) {
      setMedicines([]);
      setError(getError(err, "Không thể tải danh sách thuốc."));
    } finally {
      setLoading(false);
    }
  }, [page, search, refreshKey]);

  useEffect(() => {
    loadMedicines();
  }, [loadMedicines]);

  const reload = () => setRefreshKey((v) => v + 1);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
    reload();
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
      const res = await api.get(`/admin/medicines/${id}`);
      if (!res.data?.success || !res.data?.data) {
        throw new Error("Không lấy được thông tin thuốc.");
      }
      const m = res.data.data;
      setEditingId(m.med_id);
      setForm({
        name: m.name || "",
        unit: m.unit || "Viên",
        unit_price: Number(m.unit_price ?? 0),
        quantity: Number(m.quantity ?? 0),
        is_insurance_covered: Boolean(m.is_insurance_covered),
      });
      setModalOpen(true);
    } catch (err) {
      setError(getError(err, "Không thể tải chi tiết thuốc."));
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
      name: form.name.trim(),
      unit: form.unit.trim(),
      unit_price: Number(form.unit_price),
      quantity: Number(form.quantity),
      is_insurance_covered: Boolean(form.is_insurance_covered),
    };

    setBusy(true);
    try {
      const res =
        editingId === null
          ? await api.post("/admin/medicines", payload)
          : await api.put(`/admin/medicines/${editingId}`, payload);
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Không thể lưu thông tin thuốc.");
      }
      setModalOpen(false);
      setNotice(
        editingId === null
          ? "Đã thêm thuốc mới thành công."
          : `Đã cập nhật thuốc #${editingId}.`
      );
      reload();
    } catch (err) {
      setFormError(getError(err, "Không thể lưu thông tin thuốc."));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (item) => {
    if (busy) return;
    if (!window.confirm(`Xóa thuốc "${item.name}" khỏi kho?`)) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const res = await api.delete(`/admin/medicines/${item.med_id}`);
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Không thể xóa thuốc.");
      }
      setNotice(`Đã xóa thuốc "${item.name}".`);
      reload();
    } catch (err) {
      setError(getError(err, "Không thể xóa thuốc."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
            <Pill className="text-emerald-700" /> Quản lý kho thuốc
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Danh mục thuốc, đơn giá, tồn kho và áp dụng BHYT
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
            <Plus size={16} /> Thêm thuốc mới
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

      <form onSubmit={handleSearch} className="flex gap-2 rounded-xl border border-slate-200 bg-white p-4">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Tìm theo tên thuốc hoặc đơn vị tính..."
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <button type="submit" className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium">
          <Search size={16} /> Tìm
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-4">Mã thuốc</th>
              <th className="p-4">Tên thuốc</th>
              <th className="p-4">Đơn vị</th>
              <th className="p-4">Đơn giá</th>
              <th className="p-4">Tồn kho</th>
              <th className="p-4">BHYT</th>
              <th className="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-8 text-center text-slate-500">Đang tải dữ liệu...</td></tr>
            ) : medicines.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-slate-500">Không có thuốc nào phù hợp.</td></tr>
            ) : (
              medicines.map((item) => (
                <tr key={item.med_id} className="border-t border-slate-100">
                  <td className="p-4 font-mono">{item.med_id}</td>
                  <td className="p-4 font-semibold text-slate-900">{item.name}</td>
                  <td className="p-4">{item.unit}</td>
                  <td className="p-4">{Number(item.unit_price).toLocaleString("vi-VN")} đ</td>
                  <td className="p-4">
                    <span className={item.quantity <= 0 ? "font-bold text-red-600" : item.quantity < 100 ? "font-semibold text-amber-700" : "text-slate-800"}>
                      {item.quantity}
                    </span>
                  </td>
                  <td className="p-4">
                    {item.is_insurance_covered ? (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                        Có BHYT
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
                        Ngoài danh mục
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => openEdit(item.med_id)}
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
        <span>Tổng số thuốc: {total}</span>
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
              <h2 className="font-bold">{editingId === null ? "Thêm thuốc mới" : `Chỉnh sửa thuốc #${editingId}`}</h2>
              <button type="button" disabled={busy} onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 p-5 text-sm">
              {formError && <div role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{formError}</div>}
              <label className="block font-medium text-slate-700">
                Tên thuốc *
                <input
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="block font-medium text-slate-700">
                  Đơn vị *
                  <input
                    required
                    maxLength={50}
                    value={form.unit}
                    onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </label>
                <label className="block font-medium text-slate-700">
                  Đơn giá (đ) *
                  <input
                    required
                    type="number"
                    min={0}
                    step={1}
                    value={form.unit_price}
                    onChange={(e) => setForm((p) => ({ ...p, unit_price: Number(e.target.value) }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </label>
                <label className="block font-medium text-slate-700">
                  Số lượng *
                  <input
                    required
                    type="number"
                    min={0}
                    step={1}
                    value={form.quantity}
                    onChange={(e) => setForm((p) => ({ ...p, quantity: Number(e.target.value) }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </label>
              </div>
              <label className="flex items-center gap-2 font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={form.is_insurance_covered}
                  onChange={(e) => setForm((p) => ({ ...p, is_insurance_covered: e.target.checked }))}
                  className="h-4 w-4 rounded"
                />
                Áp dụng bảo hiểm y tế (BHYT)
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" disabled={busy} onClick={() => setModalOpen(false)} className="rounded-lg border px-4 py-2">
                  Hủy
                </button>
                <button type="submit" disabled={busy} className="rounded-lg bg-[#004282] px-4 py-2 font-semibold text-white disabled:opacity-50">
                  {busy ? "Đang lưu..." : "Lưu thuốc"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
