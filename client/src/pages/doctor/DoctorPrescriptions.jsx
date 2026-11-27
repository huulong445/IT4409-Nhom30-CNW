import { useState } from "react";
import { AlertCircle, FileText, Pill, Search, Trash2, Save, RotateCcw } from "lucide-react";
import api from "../../services/api";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleString("vi-VN");
};

const EMPTY_FILTERS = {
  record_id: "",
  patient_id: "",
  full_name: "",
};

const validId = (value) =>
  /^[1-9]\d*$/.test(value) && Number.isSafeInteger(Number(value));

export default function DoctorPrescriptions() {
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS });
  const [searchedLabel, setSearchedLabel] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [medicationJson, setMedicationJson] = useState("");

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const resetFilters = () => {
    setFilters({ ...EMPTY_FILTERS });
    setSearchedLabel("");
    setPrescriptions([]);
    setNotFound(false);
    setError("");
    setNotice("");
    setEditingId(null);
  };

  const performSearch = async (activeFilters = filters) => {
    const params = {};
    const recordId = activeFilters.record_id.trim();
    const patientId = activeFilters.patient_id.trim();
    const fullName = activeFilters.full_name.trim();

    setError("");
    setNotice("");
    setNotFound(false);
    setPrescriptions([]);
    setSearchedLabel("");
    setEditingId(null);

    if (recordId) {
      if (!validId(recordId)) {
        setError("record_id phải là số nguyên dương hợp lệ.");
        return;
      }
      params.record_id = recordId;
    }

    if (patientId) {
      if (!validId(patientId)) {
        setError("patient_id phải là số nguyên dương hợp lệ.");
        return;
      }
      params.patient_id = patientId;
    }

    if (fullName) {
      params.full_name = fullName;
    }

    if (Object.keys(params).length === 0) {
      setError("Vui lòng nhập ít nhất một điều kiện: record_id, patient_id hoặc tên bệnh nhân.");
      return;
    }

    setLoading(true);
    try {
      const endpoint =
        !params.record_id && (params.patient_id || params.full_name)
          ? "/doctor/prescriptions/patient"
          : "/doctor/prescriptions";
      const response = await api.get(endpoint, { params });
      const data = response.data?.data;
      if (!response.data?.success || !Array.isArray(data)) {
        throw new Error(response.data?.message || "Phản hồi API đơn thuốc không hợp lệ.");
      }

      setPrescriptions(data);
      setSearchedLabel(
        Object.entries(params)
          .map(([k, v]) => `${k}=${v}`)
          .join(", ")
      );
      if (data.length === 0) setNotFound(true);
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        setNotFound(true);
        setSearchedLabel(
          Object.entries(params)
            .map(([k, v]) => `${k}=${v}`)
            .join(", ")
        );
      } else if (status === 401 || status === 403) {
        setError("Bạn cần đăng nhập bằng tài khoản bác sĩ được xác thực để tra cứu.");
      } else if (status === 502 || status === 503 || !err.response) {
        setError("Không kết nối được backend. Chưa thể tra cứu đơn thuốc.");
      } else {
        setError(err.response?.data?.message || err.message || "Không thể tra cứu đơn thuốc.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (!loading) performSearch();
  };

  const startEdit = (prescription) => {
    setError("");
    setNotice("");
    const source = prescription.medication_details ?? prescription.details ?? [];
    setEditingId(prescription.prescription_id);
    setMedicationJson(
      typeof source === "string" ? source : JSON.stringify(source, null, 2)
    );
  };

  const handleUpdate = async (prescriptionId) => {
    if (busyId) return;
    let details;
    try {
      details = JSON.parse(medicationJson);
      if (!Array.isArray(details) || details.length === 0) {
        throw new Error("Danh sách thuốc cần là một mảng JSON có ít nhất một mục.");
      }
    } catch (err) {
      setError("Nội dung JSON không hợp lệ: " + err.message);
      return;
    }

    if (!window.confirm(`Cập nhật nội dung đơn thuốc #${prescriptionId} trên backend?`)) return;
    setBusyId(prescriptionId);
    setError("");
    setNotice("");
    try {
      const res = await api.put(
        "/doctor/prescriptions",
        { medication_details: details },
        { params: { prescription_id: prescriptionId } }
      );
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Backend không xác nhận cập nhật.");
      }
      setNotice(`Đã cập nhật đơn thuốc #${prescriptionId}.`);
      setEditingId(null);
      await performSearch();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Không thể cập nhật đơn thuốc.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (prescriptionId) => {
    if (busyId) return;
    const id = String(prescriptionId);
    if (window.prompt(`Xóa đơn thuốc #${id}? Nhập ${id} để xác nhận:`) !== id) return;
    setBusyId(prescriptionId);
    setError("");
    setNotice("");
    try {
      const res = await api.delete("/doctor/prescriptions", {
        params: { prescription_id: prescriptionId },
      });
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Backend không xác nhận xóa.");
      }
      setNotice(`Đã xóa đơn thuốc #${id}.`);
      setPrescriptions((prev) => prev.filter((item) => item.prescription_id !== prescriptionId));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Không thể xóa đơn thuốc.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
          <Pill className="text-emerald-700" /> Tra cứu đơn thuốc
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Tra cứu đơn thuốc theo mã bệnh án , mã bệnh nhân  hoặc họ tên bệnh nhân.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-5"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className="space-y-1 text-sm font-medium text-slate-700">
            Mã bệnh án
            <input
              type="text"
              inputMode="numeric"
              value={filters.record_id}
              disabled={loading || Boolean(busyId)}
              onChange={(event) => handleFilterChange("record_id", event.target.value)}
              placeholder="Ví dụ: 1"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal focus:border-blue-500 focus:outline-none disabled:opacity-60"
            />
          </label>
          <label className="space-y-1 text-sm font-medium text-slate-700">
            Mã bệnh nhân
            <input
              type="text"
              inputMode="numeric"
              value={filters.patient_id}
              disabled={loading || Boolean(busyId)}
              onChange={(event) => handleFilterChange("patient_id", event.target.value)}
              placeholder="Ví dụ: 1"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal focus:border-blue-500 focus:outline-none disabled:opacity-60"
            />
          </label>
          <label className="space-y-1 text-sm font-medium text-slate-700">
            Tên bệnh nhân
            <input
              type="text"
              value={filters.full_name}
              disabled={loading || Boolean(busyId)}
              onChange={(event) => handleFilterChange("full_name", event.target.value)}
              placeholder="Ví dụ: Nguyễn Văn An"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal focus:border-blue-500 focus:outline-none disabled:opacity-60"
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={loading || Boolean(busyId)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#004282] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            <Search size={16} /> {loading ? "Đang tra cứu..." : "Tìm kiếm"}
          </button>
          <button
            type="button"
            onClick={resetFilters}
            disabled={loading || Boolean(busyId)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RotateCcw size={16} /> Xóa bộ lọc
          </button>
        </div>
      </form>

      {notice && !error && (
        <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{notice}</p>
      )}

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {notFound && (
        <div role="status" className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          Không tìm thấy đơn thuốc nào phù hợp ({searchedLabel}).
        </div>
      )}

      {prescriptions.map((prescription) => {
        const details = Array.isArray(prescription.details) ? prescription.details : [];
        const isEditing = editingId === prescription.prescription_id;
        return (
          <div key={prescription.prescription_id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                <FileText size={19} className="text-[#004282]" /> Đơn thuốc #{prescription.prescription_id}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={Boolean(busyId)}
                  onClick={() => (isEditing ? setEditingId(null) : startEdit(prescription))}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 disabled:opacity-50"
                >
                  <Save size={14} /> {isEditing ? "Đóng chỉnh sửa" : "Cập nhật (PUT)"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(prescription.prescription_id)}
                  disabled={Boolean(busyId)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 disabled:opacity-50"
                >
                  <Trash2 size={14} /> Xóa đơn
                </button>
              </div>
            </div>

            <dl className="grid gap-4 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-slate-500">Mã đơn thuốc</dt>
                <dd className="mt-1 font-semibold text-slate-900">{prescription.prescription_id}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Mã bệnh án</dt>
                <dd className="mt-1 font-semibold text-slate-900">{prescription.record_id}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Mã nhân sự bác sĩ</dt>
                <dd className="mt-1 font-semibold text-slate-900">{prescription.doctor_id ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Thời điểm tạo</dt>
                <dd className="mt-1 font-semibold text-slate-900">{formatDate(prescription.created_at)}</dd>
              </div>
            </dl>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-3 py-2.5">Mã thuốc</th>
                    <th className="px-3 py-2.5">Tên thuốc</th>
                    <th className="px-3 py-2.5">Số lượng</th>
                    <th className="px-3 py-2.5">Đơn giá</th>
                    <th className="px-3 py-2.5">Liều dùng</th>
                    <th className="px-3 py-2.5">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {details.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-4 text-center text-slate-500">
                        Chưa có chi tiết thuốc trong đơn.
                      </td>
                    </tr>
                  ) : (
                    details.map((item, idx) => (
                      <tr key={item.detail_id ?? idx}>
                        <td className="px-3 py-2 font-mono">{item.med_id ?? "—"}</td>
                        <td className="px-3 py-2 font-semibold text-slate-800">{item.med_name || "—"}</td>
                        <td className="px-3 py-2">{item.quantity ?? "—"}</td>
                        <td className="px-3 py-2">
                          {item.unit_price != null ? `${Number(item.unit_price).toLocaleString("vi-VN")} đ` : "—"}
                        </td>
                        <td className="px-3 py-2">{item.dosage || "—"}</td>
                        <td className="px-3 py-2 text-slate-600">{item.note || "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {isEditing && (
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <label className="block text-sm font-semibold text-slate-700">
                  Nội dung JSON cập nhật (PUT /doctor/prescriptions?prescription_id={prescription.prescription_id})
                  <textarea
                    rows={6}
                    value={medicationJson}
                    disabled={Boolean(busyId)}
                    onChange={(e) => setMedicationJson(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-mono text-xs"
                  />
                </label>
                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  <span>Gửi payload <code>medication_details</code> lên API PUT của backend theo prescription_id.</span>
                </div>
                <button
                  type="button"
                  disabled={Boolean(busyId)}
                  onClick={() => handleUpdate(prescription.prescription_id)}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#004282] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                >
                  <Save size={14} /> Lưu cập nhật
                </button>
              </div>
            )}
          </div>
        );
      })}

      {!loading && prescriptions.length === 0 && !error && !notFound && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Chọn tiêu chí và nhập mã bệnh án, mã bệnh nhân hoặc tên bệnh nhân để tra cứu đơn thuốc.
        </div>
      )}
    </div>
  );
}
